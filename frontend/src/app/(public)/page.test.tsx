import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Home from './page'

describe('Home Page', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza el título principal y muestra la respuesta GET del backend', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      text: () => Promise.resolve('Hello World!'),
    } as Response)

    render(<Home />)
    expect(screen.getByText(/To get started, edit the/i)).toBeDefined()

    await waitFor(() => {
      expect(screen.getByText('Hello World!')).toBeDefined()
    })
  })

  it('muestra mensaje de error si falla la conexión con el backend', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Error connecting to backend')).toBeDefined()
    })
  })
})