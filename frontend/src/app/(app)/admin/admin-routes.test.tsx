import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/services/api-client'
import AdminLayout from './layout'
import AdminHomePage from './page'
import RegisteredUsersReportPage from './reports/registered-users/page'
import RejectedUsersReportPage from './reports/rejected-users/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
}))

const EMPTY_PAGE = {
  data: { data: { items: [], total: 0, page: 1, limit: 10 } },
}

describe('Rutas de administración', () => {
  beforeEach(() => {
    vi.spyOn(apiClient, 'get').mockResolvedValue(EMPTY_PAGE)
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
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

  it('la página del reporte muestra la vista de usuarios registrados', async () => {
    render(<RegisteredUsersReportPage />)

    expect(
      screen.getByRole('heading', { name: 'Reporte de usuarios registrados' }),
    ).toBeDefined()
    expect(
      await screen.findByText('No hay usuarios registrados para mostrar.'),
    ).toBeDefined()
  })

  it('la página de rechazados muestra la vista de usuarios rechazados', async () => {
    render(<RejectedUsersReportPage />)

    expect(
      screen.getByRole('heading', { name: 'Reporte de usuarios rechazados' }),
    ).toBeDefined()
    expect(
      await screen.findByText('No hay usuarios rechazados para mostrar.'),
    ).toBeDefined()
  })
})
