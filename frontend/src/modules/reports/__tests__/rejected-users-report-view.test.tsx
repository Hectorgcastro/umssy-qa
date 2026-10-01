import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/services/api-client'
import { RejectedUsersReportView } from '../index'
import { buildApiPage, buildReportUser } from './report-test-data'

const getSpy = vi.spyOn(apiClient, 'get')

describe('RejectedUsersReportView', () => {
  beforeEach(() => {
    getSpy.mockResolvedValue(
      buildApiPage([
        buildReportUser({
          fullName: 'Juan Carlos Peres Rojas',
          registrationStatus: 'rejected',
          rejectionReason: 'No presentó documento.',
        }),
      ]),
    )
  })

  afterEach(() => {
    cleanup()
    getSpy.mockReset()
  })

  it('muestra la ruta, el título, el buscador y los botones', async () => {
    render(<RejectedUsersReportView />)
    await screen.findByText('Juan Carlos Peres Rojas')

    const breadcrumb = within(
      screen.getByRole('navigation', { name: 'Ruta de navegación' }),
    )
    expect(
      breadcrumb
        .getByText('Reporte de usuarios rechazados')
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Reporte de usuarios rechazados',
      }),
    ).toBeDefined()
    expect(
      screen.getByRole('searchbox', { name: 'Buscar usuarios rechazados' }),
    ).toBeDefined()
    expect(screen.getByRole('button', { name: 'Actualizar' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Exportar CSV' })).toBeDefined()
  })

  it('muestra las columnas y los usuarios rechazados', async () => {
    render(<RejectedUsersReportView />)
    await screen.findByText('Juan Carlos Peres Rojas')

    const headers = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent)
    expect(headers).toEqual([
      'Usuario',
      'Correo',
      'Identificador',
      'Documento',
      'Fecha de Registro',
    ])
    expect(screen.getByText('Mostrando 1-1 de 1 usuarios')).toBeDefined()
    expect(getSpy).toHaveBeenCalledWith('/reports/rejected-users', {
      params: { page: 1, limit: 10 },
    })
  })

  it('busca después de que el usuario deja de escribir', async () => {
    render(<RejectedUsersReportView />)
    await screen.findByText('Juan Carlos Peres Rojas')
    const callsBefore = getSpy.mock.calls.length

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Buscar usuarios rechazados' }),
      { target: { value: ' juan ' } },
    )
    expect(getSpy.mock.calls.length).toBe(callsBefore)

    await waitFor(() =>
      expect(getSpy).toHaveBeenLastCalledWith('/reports/rejected-users', {
        params: { page: 1, limit: 10, search: 'juan' },
      }),
    )
  })

  it('muestra un mensaje si no hay rechazados', async () => {
    getSpy.mockResolvedValue(buildApiPage([]))

    render(<RejectedUsersReportView />)

    expect(
      await screen.findByText('No hay usuarios rechazados para mostrar.'),
    ).toBeDefined()
  })
})
