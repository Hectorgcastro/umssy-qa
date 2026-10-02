import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import { useAvailability, useAvailabilityBlock } from "./use-availability"
import { availabilityApi } from "../services/availability.api"

describe("useAvailability", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("inicializa con estado de carga", () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockImplementation(
      () => new Promise(() => {})
    )

    const { result } = renderHook(() => useAvailability())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.blocks).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it("obtiene bloques de disponibilidad correctamente", async () => {
    const mockBlocks = [
      { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" },
    ]
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue(mockBlocks)

    const { result } = renderHook(() => useAvailability())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.blocks).toEqual(mockBlocks)
    expect(result.current.error).toBeNull()
  })

  it("maneja error al obtener bloques", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useAvailability())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe("Error al obtener los bloques de disponibilidad")
    expect(result.current.blocks).toEqual([])
  })

  it("crea un bloque de disponibilidad", async () => {
    const mockBlocks = [
      { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" },
    ]
    const newBlock = { id: "2", mentorId: "m1", startAt: "2024-01-15T14:00:00Z", endAt: "2024-01-15T15:00:00Z", createdAt: "", updatedAt: "" }
    
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue(mockBlocks)
    const createSpy = vi.spyOn(availabilityApi, "createAvailabilityBlock").mockResolvedValue(newBlock)

    const { result } = renderHook(() => useAvailability())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const created = await act(async () => {
      return result.current.createBlock({
        mentorId: "m1",
        startAt: "2024-01-15T14:00:00Z",
        endAt: "2024-01-15T15:00:00Z",
      })
    })

    expect(createSpy).toHaveBeenCalled()
    expect(created).toEqual(newBlock)
    expect(result.current.blocks).toHaveLength(2)
  })

  it("maneja error al crear bloque", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])
    vi.spyOn(availabilityApi, "createAvailabilityBlock").mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useAvailability())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const created = await act(async () => {
      return result.current.createBlock({
        mentorId: "m1",
        startAt: "2024-01-15T14:00:00Z",
        endAt: "2024-01-15T15:00:00Z",
      })
    })

    expect(created).toBeNull()
    expect(result.current.error).toBe("Error al crear el bloque de disponibilidad")
  })

  it("actualiza un bloque de disponibilidad", async () => {
    const mockBlocks = [
      { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" },
    ]
    const updatedBlock = { id: "1", mentorId: "m1", startAt: "2024-01-15T12:00:00Z", endAt: "2024-01-15T13:00:00Z", createdAt: "", updatedAt: "" }
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue(mockBlocks)
    const updateSpy = vi.spyOn(availabilityApi, "updateAvailabilityBlock").mockResolvedValue(updatedBlock)

    const { result } = renderHook(() => useAvailability())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const updated = await act(async () => {
      return result.current.updateBlock("1", { startAt: "2024-01-15T12:00:00Z" })
    })

    expect(updateSpy).toHaveBeenCalledWith("1", { startAt: "2024-01-15T12:00:00Z" })
    expect(updated).toEqual(updatedBlock)
    expect(result.current.blocks[0].startAt).toBe("2024-01-15T12:00:00Z")
  })

  it("elimina un bloque de disponibilidad", async () => {
    const mockBlocks = [
      { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" },
      { id: "2", mentorId: "m1", startAt: "2024-01-15T14:00:00Z", endAt: "2024-01-15T15:00:00Z", createdAt: "", updatedAt: "" },
    ]
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue(mockBlocks)
    const deleteSpy = vi.spyOn(availabilityApi, "deleteAvailabilityBlock").mockResolvedValue(undefined)

    const { result } = renderHook(() => useAvailability())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const deleted = await act(async () => {
      return result.current.deleteBlock("1")
    })

    expect(deleteSpy).toHaveBeenCalledWith("1")
    expect(deleted).toBe(true)
    expect(result.current.blocks).toHaveLength(1)
    expect(result.current.blocks[0].id).toBe("2")
  })
})

describe("useAvailabilityBlock", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("obtiene un bloque por ID", async () => {
    const mockBlock = { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" }
    vi.spyOn(availabilityApi, "getAvailabilityBlockById").mockResolvedValue(mockBlock)

    const { result } = renderHook(() => useAvailabilityBlock("1"))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.block).toEqual(mockBlock)
    expect(result.current.error).toBeNull()
  })

  it("maneja error al obtener bloque por ID", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlockById").mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useAvailabilityBlock("1"))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.block).toBeNull()
    expect(result.current.error).toBe("Error al obtener el bloque de disponibilidad")
  })

  it("no hace petición si no hay ID", () => {
    const spy = vi.spyOn(availabilityApi, "getAvailabilityBlockById")

    renderHook(() => useAvailabilityBlock(""))

    expect(spy).not.toHaveBeenCalled()
  })
})
