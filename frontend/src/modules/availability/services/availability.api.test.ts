import { describe, it, expect, vi, beforeEach } from "vitest"
import { availabilityApi } from "./availability.api"
import { apiClient } from "@/shared/services/api-client"
import type { AvailabilityBlock } from "../types/availability"

describe("availabilityApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("getAvailabilityBlocks llama a la API con filtros correctos", async () => {
    const mockBlocks: AvailabilityBlock[] = [
      { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" },
    ]
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue({ data: mockBlocks })

    const result = await availabilityApi.getAvailabilityBlocks({ mentorId: "m1", startAt: "2024-01-15" })

    expect(getSpy).toHaveBeenCalledWith("/availability-blocks?mentorId=m1&startAt=2024-01-15T00%3A00%3A00.000Z")
    expect(result).toEqual(mockBlocks)
  })

  it("getAvailabilityBlocks llama a la API sin filtros", async () => {
    const mockBlocks: AvailabilityBlock[] = [
      { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" },
    ]
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue({ data: mockBlocks })

    const result = await availabilityApi.getAvailabilityBlocks()

    expect(getSpy).toHaveBeenCalledWith("/availability-blocks?")
    expect(result).toEqual(mockBlocks)
  })

  it("getAvailabilityBlockById llama a la API con ID correcto", async () => {
    const mockBlock: AvailabilityBlock = { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" }
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue({ data: mockBlock })

    const result = await availabilityApi.getAvailabilityBlockById("1")

    expect(getSpy).toHaveBeenCalledWith("/availability-blocks/1")
    expect(result).toEqual(mockBlock)
  })

  it("createAvailabilityBlock llama a la API con datos correctos y convierte fechas a ISO", async () => {
    const input = { mentorId: "m1", startAt: "2024-01-15T10:00", endAt: "2024-01-15T11:00", seriesId: "s1", repeatUntil: "2024-12-31" }
    const mockBlock: AvailabilityBlock = { id: "1", ...input, createdAt: "", updatedAt: "" }
    const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue({ data: mockBlock })

    await availabilityApi.createAvailabilityBlock(input)

    const [url, payload] = postSpy.mock.calls[0] as [string, Record<string, unknown>]
    expect(url).toBe("/availability-blocks")
    expect(payload.mentorId).toBe("m1")
    expect(typeof payload.startAt).toBe("string")
    expect(payload.startAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    expect(typeof payload.endAt).toBe("string")
    expect(payload.endAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    // seriesId se genera automáticamente como UUID
    expect(typeof payload.seriesId).toBe("string")
    expect(payload.seriesId).toMatch(/^[0-9a-f-]{36}$/)
    expect(payload.repeatUntil).toBe("2024-12-31")
  })

  it("updateAvailabilityBlock llama a la API con ID y datos correctos", async () => {
    const input = { startAt: "2024-01-15T12:00" }
    const mockBlock: AvailabilityBlock = { id: "1", mentorId: "m1", startAt: "2024-01-15T12:00:00Z", endAt: "2024-01-15T13:00:00Z", createdAt: "", updatedAt: "" }
    const patchSpy = vi.spyOn(apiClient, "patch").mockResolvedValue({ data: mockBlock })

    await availabilityApi.updateAvailabilityBlock("1", input)

    const [url, payload] = patchSpy.mock.calls[0] as [string, Record<string, unknown>]
    expect(url).toBe("/availability-blocks/1")
    expect(typeof payload.startAt).toBe("string")
    expect(payload.startAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })

  it("deleteAvailabilityBlock llama a la API con ID correcto", async () => {
    const deleteSpy = vi.spyOn(apiClient, "delete").mockResolvedValue({})

    await availabilityApi.deleteAvailabilityBlock("1")

    expect(deleteSpy).toHaveBeenCalledWith("/availability-blocks/1")
  })
})
