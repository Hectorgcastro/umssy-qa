import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { MentorPublicAvailabilityView } from "./mentor-public-availability-view"
import { availabilityApi } from "../services/availability.api"

describe("MentorPublicAvailabilityView", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("renderiza estado de carga inicial", () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockImplementation(
      () => new Promise(() => {})
    )

    render(<MentorPublicAvailabilityView mentorId="m1" />)
    expect(screen.getByText("Cargando disponibilidad...")).toBeInTheDocument()
  })

  it("renderiza lista de bloques de disponibilidad del mentor", async () => {
    const mockBlocks = [
      { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" },
    ]
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue(mockBlocks)

    render(<MentorPublicAvailabilityView mentorId="m1" />)

    await waitFor(() => {
      expect(screen.getByText("Disponibilidad del Mentor")).toBeInTheDocument()
    })
    expect(screen.getByText(/Inicio:/)).toBeInTheDocument()
    expect(screen.getByText(/Fin:/)).toBeInTheDocument()
  })

  it("renderiza mensaje cuando no hay bloques", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])

    render(<MentorPublicAvailabilityView mentorId="m1" />)

    await waitFor(() => {
      expect(screen.getByText("No hay bloques de disponibilidad disponibles.")).toBeInTheDocument()
    })
  })

  it("renderiza error cuando falla la petición", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockRejectedValue(new Error("Network error"))

    render(<MentorPublicAvailabilityView mentorId="m1" />)

    await waitFor(() => {
      expect(screen.getByText("Error al obtener los bloques de disponibilidad")).toBeInTheDocument()
    })
  })

  it("pasa mentorId como filtro a la API", async () => {
    const spy = vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])

    render(<MentorPublicAvailabilityView mentorId="mentor-123" />)

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({ mentorId: "mentor-123" })
    })
  })
})
