import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SelectField } from './select-field'

const OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'graduate', label: 'Titulado' },
  { value: 'alumni', label: 'Egresado' },
]

function renderSelect(onChange?: (value: string) => void) {
  render(
    <div>
      <SelectField
        label="Tipo de usuario"
        options={OPTIONS}
        defaultValue="all"
        onChange={onChange}
      />
      <p>Fuera</p>
    </div>,
  )
  return screen.getByRole('combobox', { name: 'Tipo de usuario' })
}

describe('SelectField', () => {
  afterEach(() => {
    cleanup()
  })

  it('muestra la opción por defecto con la lista cerrada', () => {
    const combobox = renderSelect()

    expect(combobox.textContent).toContain('Todos')
    expect(combobox.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('abre la lista al hacer clic y marca la opción seleccionada', () => {
    const combobox = renderSelect()

    fireEvent.click(combobox)

    expect(combobox.getAttribute('aria-expanded')).toBe('true')
    expect(
      screen.getByRole('option', { name: 'Todos' }).getAttribute('aria-selected'),
    ).toBe('true')
    expect(
      screen
        .getByRole('option', { name: 'Titulado' })
        .getAttribute('aria-selected'),
    ).toBe('false')
  })

  it('selecciona una opción con el mouse y avisa el cambio', () => {
    const handleChange = vi.fn()
    const combobox = renderSelect(handleChange)

    fireEvent.click(combobox)
    const option = screen.getByRole('option', { name: 'Egresado' })
    fireEvent.mouseEnter(option)
    fireEvent.mouseDown(option)
    fireEvent.click(option)

    expect(combobox.textContent).toContain('Egresado')
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(handleChange).toHaveBeenCalledWith('alumni')
  })

  it('cierra la lista al hacer clic de nuevo o fuera del componente', () => {
    const combobox = renderSelect()

    fireEvent.click(combobox)
    fireEvent.click(combobox)
    expect(screen.queryByRole('listbox')).toBeNull()

    fireEvent.click(combobox)
    fireEvent.mouseDown(combobox)
    expect(screen.getByRole('listbox')).toBeDefined()

    fireEvent.mouseDown(screen.getByText('Fuera'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('permite navegar y seleccionar con el teclado', () => {
    const combobox = renderSelect()

    fireEvent.keyDown(combobox, { key: 'ArrowUp' })
    expect(screen.queryByRole('listbox')).toBeNull()

    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    expect(screen.getByRole('listbox')).toBeDefined()

    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    expect(combobox.getAttribute('aria-activedescendant')).toContain('option-2')

    fireEvent.keyDown(combobox, { key: 'ArrowUp' })
    fireEvent.keyDown(combobox, { key: 'Enter' })
    expect(combobox.textContent).toContain('Titulado')
    expect(screen.queryByRole('listbox')).toBeNull()

    fireEvent.keyDown(combobox, { key: ' ' })
    expect(screen.getByRole('listbox')).toBeDefined()
    fireEvent.keyDown(combobox, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()

    fireEvent.keyDown(combobox, { key: 'a' })
    expect(screen.queryByRole('listbox')).toBeNull()
  })
})
