import { describe, it, expect, vi, beforeEach } from "vitest"
import { availabilityApi } from "./availability.api"
import { apiClient } from "@/shared/services/api-client"

describe("availabilityApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("getAvailabilityBlocks llama a la API con filtros correctos", async () => {
    const mockBlocks = [
      { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" },
    ]
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue({ data: mockBlocks })

    const result = await availabilityApi.getAvailabilityBlocks({ mentorId: "m1", startAt: "2024-01-15" })

    expect(getSpy).toHaveBeenCalledWith("/availability?mentorId=m1&startAt=2024-01-15")
    expect(result).toEqual(mockBlocks)
  })

  it("getAvailabilityBlocks llama a la API sin filtros", async () => {
    const mockBlocks = [
      { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" },
    ]
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue({ data: mockBlocks })

    const result = await availabilityApi.getAvailabilityBlocks()

    expect(getSpy).toHaveBeenCalledWith("/availability?")
    expect(result).toEqual(mockBlocks)
  })

  it("getAvailabilityBlockById llama a la API con ID correcto", async () => {
    const mockBlock = { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" }
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue({ data: mockBlock })

    const result = await availabilityApi.getAvailabilityBlockById("1")

    expect(getSpy).toHaveBeenCalledWith("/availability/1")
    expect(result).toEqual(mockBlock)
  })

  it("createAvailabilityBlock llama a la API con datos correctos", async () => {
    const input = { mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", seriesId: "s1", repeatUntil: "2024-12-31" }
    const mockBlock = { id: "1", ...input, createdAt: "", updatedAt: "" }
    const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue({ data: mockBlock })

    const result = await availabilityApi.createAvailabilityBlock(input)

    expect(postSpy).toHaveBeenCalledWith("/availability", input)
    expect(result).toEqual(mockBlock)
  })

  it("updateAvailabilityBlock llama a la API con ID y datos correctos", async () => {
    const input = { startAt: "2024-01-15T12:00:00Z" }
    const mockBlock = { id: "1", mentorId: "m1", startAt: "2024-01-15T12:00:00Z", endAt: "2024-01-15T13:00:00Z", createdAt: "", updatedAt: "" }
    const patchSpy = vi.spyOn(apiClient, "patch").mockResolvedValue({ data: mockBlock })

    const result = await availabilityApi.updateAvailabilityBlock("1", input)

    expect(patchSpy).toHaveBeenCalledWith("/availability/1", input)
    expect(result).toEqual(mockBlock)
  })

  it("deleteAvailabilityBlock llama a la API con ID correcto", async () => {
    const deleteSpy = vi.spyOn(apiClient, "delete").mockResolvedValue({})

    await availabilityApi.deleteAvailabilityBlock("1")

    expect(deleteSpy).toHaveBeenCalledWith("/availability/1")
  })
})
