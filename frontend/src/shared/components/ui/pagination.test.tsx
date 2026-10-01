import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Pagination } from './pagination'

function renderPagination(page: number, total: number) {
  const handlePageChange = vi.fn()
  render(
    <Pagination
      page={page}
      limit={10}
      total={total}
      itemLabel="usuarios"
      onPageChange={handlePageChange}
    />,
  )
  return handlePageChange
}

describe('Pagination', () => {
  afterEach(() => {
    cleanup()
  })

  it('muestra el rango visible y marca la página actual', () => {
    renderPagination(2, 24)

    expect(screen.getByText('Mostrando 11-20 de 24 usuarios')).toBeDefined()
    expect(
      screen.getByRole('button', { name: 'Página 2' }).getAttribute('aria-current'),
    ).toBe('page')
    expect(screen.getAllByRole('button', { name: /^Página \d$/ })).toHaveLength(3)
  })

  it('navega con las flechas y los números', () => {
    const handlePageChange = renderPagination(2, 24)

    fireEvent.click(screen.getByRole('button', { name: 'Página anterior' }))
    fireEvent.click(screen.getByRole('button', { name: 'Página siguiente' }))
    fireEvent.click(screen.getByRole('button', { name: 'Página 3' }))

    expect(handlePageChange.mock.calls).toEqual([[1], [3], [3]])
  })

  it('desactiva las flechas en los extremos', () => {
    renderPagination(1, 5)

    expect(
      (screen.getByRole('button', { name: 'Página anterior' }) as HTMLButtonElement).disabled,
    ).toBe(true)
    expect(
      (screen.getByRole('button', { name: 'Página siguiente' }) as HTMLButtonElement).disabled,
    ).toBe(true)
    expect(screen.getByText('Mostrando 1-5 de 5 usuarios')).toBeDefined()
  })

  it('muestra cero cuando no hay resultados', () => {
    renderPagination(1, 0)

    expect(screen.getByText('Mostrando 0-0 de 0 usuarios')).toBeDefined()
  })
})
