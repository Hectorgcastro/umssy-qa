import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Home from './page'

const expectSkillChipToBeVisible = (label: RegExp) => {
  const buttons = screen.getAllByRole('button', { name: label })
  expect(buttons.length).toBeGreaterThan(0)
}

describe('Home Page', () => {
  it('renderiza el formulario de descripción de trabajo y selector de habilidades', () => {
    render(<Home />)

    expect(screen.getByText('Requisitos técnicos')).toBeDefined()
    expect(screen.getByText('CHIPS SELECCIONABLES')).toBeDefined()
  })

  it('renderiza las habilidades técnicas iniciales', () => {
    render(<Home />)

    expectSkillChipToBeVisible(/Python/i)
    expectSkillChipToBeVisible(/Docker/i)
    expectSkillChipToBeVisible(/Kali/i)
  })
})
