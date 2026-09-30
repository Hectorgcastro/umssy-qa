import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SearchInput } from './search-input'

function renderSearch(onChange?: (value: string) => void) {
  render(
    <SearchInput
      label="Buscar usuarios"
      placeholder="Buscar por nombre"
      onChange={onChange}
    />,
  )
  return screen.getByRole('searchbox', {
    name: 'Buscar usuarios',
  }) as HTMLInputElement
}

describe('SearchInput', () => {
  afterEach(() => {
    cleanup()
  })

  it('empieza vacío y sin botón para limpiar', () => {
    const input = renderSearch()

    expect(input.value).toBe('')
    expect(input.placeholder).toBe('Buscar por nombre')
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).toBeNull()
  })

  it('actualiza el texto y avisa cada cambio', () => {
    const handleChange = vi.fn()
    const input = renderSearch(handleChange)

    fireEvent.change(input, { target: { value: 'juan' } })

    expect(input.value).toBe('juan')
    expect(handleChange).toHaveBeenCalledWith('juan')
    expect(screen.getByRole('button', { name: 'Limpiar búsqueda' })).toBeDefined()
  })

  it('limpia el texto y devuelve el foco al buscador', () => {
    const handleChange = vi.fn()
    const input = renderSearch(handleChange)

    fireEvent.change(input, { target: { value: 'juan' } })
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }))

    expect(input.value).toBe('')
    expect(handleChange).toHaveBeenLastCalledWith('')
    expect(document.activeElement).toBe(input)
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).toBeNull()
  })

  it('funciona sin callback de cambios', () => {
    const input = renderSearch()

    fireEvent.change(input, { target: { value: 'ana' } })
    expect(input.value).toBe('ana')
  })
})
