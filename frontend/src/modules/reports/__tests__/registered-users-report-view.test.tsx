import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { RegisteredUsersReportView } from '../index'

describe('RegisteredUsersReportView', () => {
  afterEach(() => {
    cleanup()
  })

  it('muestra la ruta de navegación con el último elemento como actual', () => {
    render(<RegisteredUsersReportView />)

    const breadcrumb = within(
      screen.getByRole('navigation', { name: 'Ruta de navegación' }),
    )
    expect(breadcrumb.getByRole('link', { name: 'Inicio' }).getAttribute('href')).toBe('/admin')
    expect(breadcrumb.getByText('Reportes Analíticos').tagName).toBe('SPAN')
    expect(
      breadcrumb
        .getByText('Reporte de usuarios registrados')
        .getAttribute('aria-current'),
    ).toBe('page')
  })

  it('muestra el título de la página', () => {
    render(<RegisteredUsersReportView />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Reporte de usuarios registrados',
      }),
    ).toBeDefined()
  })

  it('muestra el filtro por tipo de usuario con "Todos" seleccionado', () => {
    render(<RegisteredUsersReportView />)

    const select = screen.getByRole('combobox', { name: 'Tipo de usuario' })
    expect(select.textContent).toContain('Todos')

    fireEvent.click(select)
    expect(screen.getAllByRole('option')).toHaveLength(5)
  })

  it('muestra los botones de acciones', () => {
    render(<RegisteredUsersReportView />)

    expect(screen.getByRole('button', { name: 'Actualizar' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Exportar CSV' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Gestión' })).toBeDefined()
  })

  it('muestra las columnas de la tabla sin datos', () => {
    render(<RegisteredUsersReportView />)

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
    expect(
      screen.getByText('No hay usuarios registrados para mostrar.'),
    ).toBeDefined()
  })
})
