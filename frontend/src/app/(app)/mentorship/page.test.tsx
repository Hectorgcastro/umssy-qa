import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MentorshipPage from './page'

describe('MentorshipPage', () => {
  it('renderiza la vista de mentoría', () => {
    render(<MentorshipPage />)

    expect(screen.getByText('Participa como mentor')).toBeDefined()
    expect(screen.getByText('Paso 1: Participación')).toBeDefined()
  })
})