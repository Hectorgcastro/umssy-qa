import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { RejectedUsersReportView } from '../index'

describe('RejectedUsersReportView', () => {
  afterEach(() => {
    cleanup()
  })

  it('muestra la ruta de navegación y el título', () => {
    render(<RejectedUsersReportView />)

    const breadcrumb = within(
      screen.getByRole('navigation', { name: 'Ruta de navegación' }),
    )
    expect(breadcrumb.getByRole('link', { name: 'Inicio' })).toBeDefined()
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
  })

  it('muestra el buscador y los botones de acciones', () => {
    render(<RejectedUsersReportView />)

    expect(
      screen.getByRole('searchbox', { name: 'Buscar usuarios rechazados' }),
    ).toBeDefined()
    expect(screen.getByRole('button', { name: 'Actualizar' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Exportar CSV' })).toBeDefined()
  })

  it('muestra las columnas de la tabla sin datos', () => {
    render(<RejectedUsersReportView />)

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
    expect(
      screen.getByText('No hay usuarios rechazados para mostrar.'),
    ).toBeDefined()
  })
})
