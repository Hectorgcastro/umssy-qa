import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePathname } from 'next/navigation'
import { AdminLayoutView } from '../index'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

const mockedUsePathname = vi.mocked(usePathname)

function renderLayout(pathname: string) {
  mockedUsePathname.mockReturnValue(pathname)
  return render(
    <AdminLayoutView>
      <p>Contenido de prueba</p>
    </AdminLayoutView>,
  )
}

describe('AdminLayoutView', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renderiza la marca, el menú y el contenido', () => {
    renderLayout('/admin')

    expect(screen.getByText('UMSSY')).toBeDefined()
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Solicitudes' })).toBeDefined()
    expect(
      screen.getByRole('link', { name: 'Registro de auditoría' }),
    ).toBeDefined()
    expect(screen.getByText('Contenido de prueba')).toBeDefined()
  })

  it('marca como activo el ítem de la ruta actual', () => {
    renderLayout('/admin')

    expect(
      screen.getByRole('link', { name: 'Inicio' }).getAttribute('aria-current'),
    ).toBe('page')
    expect(
      screen
        .getByRole('link', { name: 'Solicitudes' })
        .getAttribute('aria-current'),
    ).toBeNull()
  })

  it('mantiene cerrado el grupo de reportes fuera de su sección', () => {
    renderLayout('/admin')

    const groupButton = screen.getByRole('button', {
      name: 'Reportes Analíticos',
    })
    expect(groupButton.getAttribute('aria-expanded')).toBe('false')
    expect(
      screen.queryByRole('link', { name: 'Reporte de usuarios registrados' }),
    ).toBeNull()
  })

  it('abre el grupo de reportes y marca el subítem activo', () => {
    renderLayout('/admin/reports/registered-users')

    const groupButton = screen.getByRole('button', {
      name: 'Reportes Analíticos',
    })
    expect(groupButton.getAttribute('aria-expanded')).toBe('true')
    expect(
      screen
        .getByRole('link', { name: 'Reporte de usuarios registrados' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      screen
        .getByRole('link', { name: 'Reporte de usuarios rechazados' })
        .getAttribute('aria-current'),
    ).toBeNull()
  })

  it('abre y cierra el grupo de reportes al hacer clic', () => {
    renderLayout('/admin')

    const groupButton = screen.getByRole('button', {
      name: 'Reportes Analíticos',
    })

    fireEvent.click(groupButton)
    expect(groupButton.getAttribute('aria-expanded')).toBe('true')
    expect(
      screen.getByRole('link', { name: 'Historial de reportes generados' }),
    ).toBeDefined()

    fireEvent.click(groupButton)
    expect(groupButton.getAttribute('aria-expanded')).toBe('false')
  })
})
