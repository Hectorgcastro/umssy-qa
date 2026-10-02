import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, it, expect } from 'vitest'
import { MentorshipView } from './mentorship-view'

afterEach(cleanup)

describe('MentorshipView', () => {
  it('renderiza inicialmente el paso 1 con participación desmarcada', () => {
    render(<MentorshipView />)

    expect(
      screen.getByRole('heading', { name: 'Participación' }),
    ).toBeDefined()

    expect(
      screen.getByText('Quiero participar como mentor'),
    ).toBeDefined()

    const checkbox = screen.getByRole('checkbox')

    expect((checkbox as HTMLInputElement).checked).toBe(false)

    const nextButton = screen.getByRole('button', {
      name: /Continuar/i,
    })

    expect((nextButton as HTMLButtonElement).disabled).toBe(true)
  })

  it('habilita Continuar al seleccionar participación', () => {
    render(<MentorshipView />)

    const checkbox = screen.getByRole('checkbox')

    fireEvent.click(checkbox)

    expect((checkbox as HTMLInputElement).checked).toBe(true)

    const nextButton = screen.getByRole('button', {
      name: /Continuar/i,
    })

    expect((nextButton as HTMLButtonElement).disabled).toBe(false)
  })

  it('permite avanzar entre los pasos después de aceptar participación', () => {
    render(<MentorshipView />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const nextButton = screen.getByRole('button', {
      name: /Continuar/i,
    })

    fireEvent.click(nextButton)

    expect(screen.getByText('Paso 2: Áreas técnicas')).toBeDefined()

    fireEvent.click(nextButton)

    expect(screen.getByText('Paso 3: Tipos de orientación')).toBeDefined()

    fireEvent.click(nextButton)

    expect(screen.getByText('Paso 4: Confirmación')).toBeDefined()
  })

  it('deshabilita Volver en el primer paso', () => {
    render(<MentorshipView />)

    const backButton = screen.getByRole('button', {
      name: /Volver/i,
    })

    expect((backButton as HTMLButtonElement).disabled).toBe(true)
  })

  it('conserva la participación al avanzar y regresar', () => {
    render(<MentorshipView />)

    const checkbox = screen.getByRole('checkbox')

    fireEvent.click(checkbox)

    expect((checkbox as HTMLInputElement).checked).toBe(true)

    const nextButton = screen.getByRole('button', {
      name: /Continuar/i,
    })

    fireEvent.click(nextButton)

    expect(screen.getByText('Paso 2: Áreas técnicas')).toBeDefined()

    const backButton = screen.getByRole('button', {
      name: /Volver/i,
    })

    fireEvent.click(backButton)

    const participationCheckbox = screen.getByRole('checkbox')

    expect((participationCheckbox as HTMLInputElement).checked).toBe(true)
  })
})