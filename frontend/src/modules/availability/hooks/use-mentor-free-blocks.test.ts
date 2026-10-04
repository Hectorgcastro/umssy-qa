import { StrictMode } from "react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useMentorFreeBlocks } from "./use-mentor-free-blocks"
import { availabilityApi } from "../services/availability.api"
import type { AvailabilityBlock } from "../types/availability-block.types"

const CURRENT_WEEK = {
  startAt: "2026-09-28T04:00:00.000Z",
  endAt: "2026-10-05T03:59:59.999Z",
}

const mockBlock: AvailabilityBlock = {
  id: "1",
  mentorId: "m1",
  startAt: "2024-01-15T10:00:00Z",
  endAt: "2024-01-15T11:00:00Z",
  state: "free",
  createdAt: "",
  updatedAt: "",
}

describe("useMentorFreeBlocks", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-10-05T03:30:00.000Z") })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("obtiene los bloques libres del mentor en la semana actual de Bolivia", async () => {
    const spy = vi.spyOn(availabilityApi, "getMentorFreeBlocks").mockResolvedValue([mockBlock])

    const { result } = renderHook(() => useMentorFreeBlocks("m1"), { wrapper: StrictMode })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(spy).toHaveBeenCalledWith("m1", CURRENT_WEEK)
    expect(result.current.blocks).toEqual([mockBlock])
    expect(result.current.error).toBeNull()
  })

  it("maneja error al obtener bloques libres", async () => {
    vi.spyOn(availabilityApi, "getMentorFreeBlocks").mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useMentorFreeBlocks("m1"))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe("Error al obtener los bloques de disponibilidad")
  })

  it("vuelve a pedir datos cuando cambia el mentor", async () => {
    const spy = vi.spyOn(availabilityApi, "getMentorFreeBlocks").mockResolvedValue([])

    const { result, rerender } = renderHook(({ mentorId }) => useMentorFreeBlocks(mentorId), {
      initialProps: { mentorId: "m1" },
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    rerender({ mentorId: "m2" })

    expect(result.current.isLoading).toBe(true)
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(spy).toHaveBeenLastCalledWith("m2", CURRENT_WEEK)
  })
})
