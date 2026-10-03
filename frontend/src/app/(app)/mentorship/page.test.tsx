import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MentorshipPage from './page'

describe('MentorshipPage', () => {
  it('renderiza la vista de mentoría', () => {
    render(<MentorshipPage />)

    expect(screen.getByText('Participa como mentor')).toBeDefined()

    expect(
      screen.getByRole('heading', { name: 'Participación' }),
    ).toBeDefined()

    expect(
      screen.getByText('Quiero participar como mentor'),
    ).toBeDefined()
  })
})