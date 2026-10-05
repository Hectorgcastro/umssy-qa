import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from './page'

describe('Home Page', () => {
  it('renderiza el formulario de descripción de trabajo y selector de habilidades', () => {
    render(<Home />)
    
    // Test that the main heading is present
    expect(screen.getByText('Requisitos técnicos')).toBeDefined()
    
    // Test that the chip label is present
    expect(screen.getByText('CHIPS SELECCIONABLES')).toBeDefined()
  })

it('renderiza las habilidades técnicas iniciales', () => {
  render(<Home />)
  
  // Test that initial skills are rendered with more specificity
  expect(screen.getByRole('button', { name: /Python/i })).toBeDefined()
  expect(screen.getByRole('button', { name: /Docker/i })).toBeDefined()
  expect(screen.getByRole('button', { name: /Kali/i })).toBeDefined()
})
})
