import { render, screen, waitFor, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NewAvailabilityView } from "./new-availability-view"
import { availabilityApi } from "../services/availability.api"

describe("NewAvailabilityView", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it("renderiza el formulario de creación", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])
    render(<NewAvailabilityView />)
    
    await waitFor(() => {
      expect(screen.getByText("Crear Nuevo Bloque de Disponibilidad")).toBeInTheDocument()
    })
    expect(screen.getByTestId("mentorId-input")).toBeInTheDocument()
    expect(screen.getByTestId("startAt-input")).toBeInTheDocument()
    expect(screen.getByTestId("endAt-input")).toBeInTheDocument()
    expect(screen.getByTestId("seriesId-input")).toBeInTheDocument()
    expect(screen.getByTestId("repeatUntil-input")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Crear" })).toBeInTheDocument()
  })

  it("crea un bloque de disponibilidad correctamente", async () => {
    const mockBlock = { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", createdAt: "", updatedAt: "" }
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])
    vi.spyOn(availabilityApi, "createAvailabilityBlock").mockResolvedValue(mockBlock)

    render(<NewAvailabilityView />)
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Crear" })).toBeInTheDocument()
    })

    await user.type(screen.getByTestId("mentorId-input"), "m1")
    await user.type(screen.getByTestId("startAt-input"), "2024-01-15T10:00")
    await user.type(screen.getByTestId("endAt-input"), "2024-01-15T11:00")
    await user.click(screen.getByRole("button", { name: "Crear" }))

    await waitFor(() => {
      expect(screen.getByText("¡Bloque de disponibilidad creado exitosamente!")).toBeInTheDocument()
    })
  })

  it("muestra error cuando falla la creación", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])
    vi.spyOn(availabilityApi, "createAvailabilityBlock").mockRejectedValue(new Error("Network error"))

    render(<NewAvailabilityView />)
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Crear" })).toBeInTheDocument()
    })

    await user.type(screen.getByTestId("mentorId-input"), "m1")
    await user.type(screen.getByTestId("startAt-input"), "2024-01-15T10:00")
    await user.type(screen.getByTestId("endAt-input"), "2024-01-15T11:00")
    await user.click(screen.getByRole("button", { name: "Crear" }))

    await waitFor(() => {
      expect(screen.getByText("Error al crear el bloque de disponibilidad")).toBeInTheDocument()
    })
  })

  it("deshabilita el botón mientras carga inicial", async () => {
    // No resuelve la promesa para mantener isLoading=true
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockImplementation(() => new Promise(() => {}))
    vi.spyOn(availabilityApi, "createAvailabilityBlock").mockResolvedValue({ 
      id: "1", mentorId: "m1", startAt: "", endAt: "", createdAt: "", updatedAt: "" 
    })

    render(<NewAvailabilityView />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Creando..." })).toBeInTheDocument()
    })

    expect(screen.getByRole("button", { name: "Creando..." })).toBeDisabled()
  })
})
