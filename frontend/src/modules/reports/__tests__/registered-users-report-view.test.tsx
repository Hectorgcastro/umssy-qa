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
import { RegisteredUsersReportView } from '../index'
import { buildApiPage, buildReportUser } from './report-test-data'

const getSpy = vi.spyOn(apiClient, 'get')
const currentYear = new Date().getFullYear()

function lastRequestParams() {
  const lastCall = getSpy.mock.calls.at(-1)
  return (lastCall?.[1] as { params: Record<string, unknown> }).params
}

async function renderWithUsers() {
  render(<RegisteredUsersReportView />)
  await screen.findByText('Ana Pérez')
}

describe('RegisteredUsersReportView', () => {
  beforeEach(() => {
    getSpy.mockResolvedValue(
      buildApiPage(
        [
          buildReportUser(),
          buildReportUser({
            id: 'user-2',
            fullName: 'Diego Mercado',
            userType: 'company',
            identifier: null,
            document: null,
          }),
        ],
        { total: 12 },
      ),
    )
  })

  afterEach(() => {
    cleanup()
    getSpy.mockReset()
  })

  it('muestra la ruta de navegación y el título', async () => {
    await renderWithUsers()

    const breadcrumb = within(
      screen.getByRole('navigation', { name: 'Ruta de navegación' }),
    )
    expect(breadcrumb.getByRole('link', { name: 'Inicio' }).getAttribute('href')).toBe('/admin')
    expect(
      breadcrumb
        .getByText('Reporte de usuarios registrados')
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Reporte de usuarios registrados',
      }),
    ).toBeDefined()
  })

  it('pide la primera página de la gestión actual con todos los tipos', async () => {
    await renderWithUsers()

    expect(getSpy).toHaveBeenCalledWith('/reports/registered-users', {
      params: { page: 1, limit: 10, userType: 'all', year: currentYear },
    })
  })

  it('muestra las columnas y los datos de cada usuario', async () => {
    await renderWithUsers()

    const headers = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent)
    expect(headers).toEqual([
      'Usuario',
      'Correo',
      'Tipo de Usuario',
      'Identificador',
      'Documento',
      'Fecha de Registro',
    ])

    const firstRow = within(screen.getByText('Ana Pérez').closest('tr')!)
    expect(firstRow.getByText('ana.perez@example.com')).toBeDefined()
    expect(firstRow.getByText('Titulado')).toBeDefined()
    expect(firstRow.getByText('DEMO-UNI-001')).toBeDefined()
    expect(firstRow.getByText('Título académico')).toBeDefined()
    expect(firstRow.getByText('15/03/2026')).toBeDefined()

    const secondRow = within(screen.getByText('Diego Mercado').closest('tr')!)
    expect(secondRow.getByText('Empresa')).toBeDefined()
    expect(secondRow.getAllByText('-')).toHaveLength(2)
  })

  it('muestra la paginación y pide otra página al hacer clic', async () => {
    await renderWithUsers()

    expect(screen.getByText('Mostrando 1-10 de 12 usuarios')).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: 'Página 2' }))

    await waitFor(() => expect(lastRequestParams()).toMatchObject({ page: 2 }))
  })

  it('filtra por tipo de usuario y vuelve a la primera página', async () => {
    await renderWithUsers()

    const select = screen.getByRole('combobox', { name: 'Tipo de usuario' })
    expect(select.textContent).toContain('Todos')
    fireEvent.click(select)
    expect(
      screen.getAllByRole('option').map((option) => option.textContent),
    ).toEqual(['Todos', 'Estudiante', 'Titulado', 'Empresa', 'Administrador'])

    fireEvent.click(screen.getByRole('option', { name: 'Estudiante' }))

    await waitFor(() =>
      expect(lastRequestParams()).toMatchObject({ userType: 'student', page: 1 }),
    )
  })

  it('filtra por gestión', async () => {
    await renderWithUsers()

    const select = screen.getByRole('combobox', { name: 'Gestión' })
    expect(select.textContent).toContain(String(currentYear))
    fireEvent.click(select)
    expect(screen.getByRole('option', { name: '2020' })).toBeDefined()
    fireEvent.click(screen.getByRole('option', { name: '2025' }))

    await waitFor(() => expect(lastRequestParams()).toMatchObject({ year: 2025 }))
  })

  it('vuelve a pedir los datos al presionar Actualizar', async () => {
    await renderWithUsers()
    const callsBefore = getSpy.mock.calls.length

    fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }))

    await waitFor(() => expect(getSpy.mock.calls.length).toBe(callsBefore + 1))
    expect(screen.getByRole('button', { name: 'Exportar CSV' })).toBeDefined()
  })

  it('muestra un mensaje si no hay usuarios', async () => {
    getSpy.mockResolvedValue(buildApiPage([]))

    render(<RegisteredUsersReportView />)

    expect(
      await screen.findByText('No hay usuarios registrados para mostrar.'),
    ).toBeDefined()
    expect(screen.queryByRole('navigation', { name: 'Paginación' })).toBeNull()
  })

  it('muestra un error si falla la petición', async () => {
    getSpy.mockRejectedValue(new Error('Network error'))

    render(<RegisteredUsersReportView />)

    expect((await screen.findByRole('alert')).textContent).toContain(
      'No se pudo cargar el reporte',
    )
  })
})
