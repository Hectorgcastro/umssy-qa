import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from './page'

describe('Home Page', () => {
  it('renderiza el título principal', () => {
    render(<Home />)
    const heading = screen.getByText(/To get started, edit the/i)
    expect(heading).toBeDefined()
  })
})