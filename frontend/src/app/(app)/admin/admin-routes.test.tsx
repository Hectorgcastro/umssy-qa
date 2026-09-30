import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AdminLayout from './layout'
import AdminHomePage from './page'
import RegisteredUsersReportPage from './reports/registered-users/page'
import RejectedUsersReportPage from './reports/rejected-users/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
}))

describe('Rutas de administración', () => {
  afterEach(() => {
    cleanup()
  })

  it('el layout envuelve el contenido con el menú lateral', () => {
    render(
      <AdminLayout params={Promise.resolve({})}>
        <p>Contenido</p>
      </AdminLayout>,
    )

    expect(screen.getByRole('navigation', { name: 'Menú principal' })).toBeDefined()
    expect(screen.getByText('Contenido')).toBeDefined()
  })

  it('la página de inicio todavía no tiene contenido', () => {
    expect(AdminHomePage()).toBeNull()
  })

  it('la página del reporte muestra la vista de usuarios registrados', () => {
    render(<RegisteredUsersReportPage />)

    expect(
      screen.getByRole('heading', { name: 'Reporte de usuarios registrados' }),
    ).toBeDefined()
  })

  it('la página de rechazados muestra la vista de usuarios rechazados', () => {
    render(<RejectedUsersReportPage />)

    expect(
      screen.getByRole('heading', { name: 'Reporte de usuarios rechazados' }),
    ).toBeDefined()
  })
})
