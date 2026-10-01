import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedCallback } from './use-debounced-callback'

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('ejecuta solo la última llamada después del retraso', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 400))

    result.current('j')
    result.current('ju')
    vi.advanceTimersByTime(399)
    expect(callback).not.toHaveBeenCalled()

    result.current('juan')
    vi.advanceTimersByTime(400)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('juan')
  })

  it('cancela la llamada pendiente al desmontarse', () => {
    const callback = vi.fn()
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, 400),
    )

    result.current('juan')
    unmount()
    vi.advanceTimersByTime(400)

    expect(callback).not.toHaveBeenCalled()
  })

  it('se desmonta sin errores si no hay llamadas pendientes', () => {
    const { unmount } = renderHook(() => useDebouncedCallback(vi.fn(), 400))

    expect(() => unmount()).not.toThrow()
  })
})
