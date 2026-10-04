import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import Home from './page'

describe('Home Page', () => {
  afterEach(() => {
    cleanup()
  })

  it('muestra el mensaje de bienvenida', () => {
    render(<Home />)
    expect(screen.getByText('Bienvenido a UMSSY')).toBeDefined()
  })

  it('muestra un enlace para iniciar sesión que apunta a /login', () => {
    render(<Home />)
    const loginLink = screen.getByRole('link', { name: 'Iniciar sesión' })
    expect(loginLink.getAttribute('href')).toBe('/login')
  })
})