import { describe, it, expect, vi } from 'vitest'
import { redirect } from 'next/navigation'
import Page from './page'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('RegisterTechnicalAreasPage', () => {
  it('redirige al flujo de activacion de mentoria', () => {
    Page()

    expect(redirect).toHaveBeenCalledWith('/mentorship')
  })
})