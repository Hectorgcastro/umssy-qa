import { render, screen, waitFor, cleanup, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { MentorAvailabilityView } from "./mentor-availability-view"
import { availabilityApi } from "../services/availability.api"

const push = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}))

describe("MentorAvailabilityView", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    push.mockClear()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it("renderiza estado de carga inicial", () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockImplementation(
      () => new Promise(() => {})
    )

    render(<MentorAvailabilityView />)
    expect(screen.getByText("Cargando disponibilidad...")).toBeInTheDocument()
  })

  it("renderiza lista de bloques de disponibilidad", async () => {
    const mockBlocks = [
      { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", state: "free" as const, createdAt: "", updatedAt: "" },
      { id: "2", mentorId: "m1", startAt: "2024-01-15T14:00:00Z", endAt: "2024-01-15T15:00:00Z", state: "free" as const, createdAt: "", updatedAt: "" },
    ]
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue(mockBlocks)

    render(<MentorAvailabilityView />)

    await waitFor(() => {
      expect(screen.getByText("Mi Disponibilidad")).toBeInTheDocument()
    })
    expect(screen.getAllByText(/Inicio:/)).toHaveLength(2)
    expect(screen.getAllByText(/Fin:/)).toHaveLength(2)
  })

  it("renderiza mensaje cuando no hay bloques", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])

    render(<MentorAvailabilityView />)

    await waitFor(() => {
      expect(screen.getByText("No hay bloques de disponibilidad aún.")).toBeInTheDocument()
    })
  })

  it("renderiza error cuando falla la petición", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockRejectedValue(new Error("Network error"))

    render(<MentorAvailabilityView />)

    await waitFor(() => {
      expect(screen.getByText("Error al obtener los bloques de disponibilidad")).toBeInTheDocument()
    })
  })

  it("abre el modal al pulsar Eliminar bloque y lo elimina al confirmar", async () => {
    const user = userEvent.setup()
    const blockA = { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", state: "free" as const, createdAt: "", updatedAt: "" }
    const blockB = { ...blockA, id: "2", startAt: "2024-01-15T14:00:00Z", endAt: "2024-01-15T15:00:00Z" }
    const getSpy = vi.spyOn(availabilityApi, "getAvailabilityBlocks")
    getSpy.mockResolvedValueOnce([blockA, blockB]).mockResolvedValue([blockB])
    const deleteSpy = vi.spyOn(availabilityApi, "deleteAvailabilityBlock").mockResolvedValue(undefined)

    render(<MentorAvailabilityView />)

    await waitFor(() => {
      expect(screen.getAllByText(/Inicio:/)).toHaveLength(2)
    })

    await user.click(screen.getAllByRole("button", { name: "Eliminar bloque" })[0])

    expect(await screen.findByText("¿Eliminar este bloque?")).toBeInTheDocument()

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Eliminar bloque" }))

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith("1")
    })
    await waitFor(() => {
      expect(screen.queryByText("¿Eliminar este bloque?")).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getAllByText(/Inicio:/)).toHaveLength(1)
    })
    expect(getSpy).toHaveBeenCalledTimes(2)
  })

  it("cancelar el modal cierra sin eliminar y conserva la lista", async () => {
    const user = userEvent.setup()
    const block = { id: "1", mentorId: "m1", startAt: "2024-01-15T10:00:00Z", endAt: "2024-01-15T11:00:00Z", state: "free" as const, createdAt: "", updatedAt: "" }
    const getSpy = vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([block])
    const deleteSpy = vi.spyOn(availabilityApi, "deleteAvailabilityBlock").mockResolvedValue(undefined)

    render(<MentorAvailabilityView />)

    await waitFor(() => {
      expect(screen.getAllByText(/Inicio:/)).toHaveLength(1)
    })

    await user.click(screen.getByRole("button", { name: "Eliminar bloque" }))
    expect(await screen.findByText("¿Eliminar este bloque?")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Cancelar" }))

    await waitFor(() => {
      expect(screen.queryByText("¿Eliminar este bloque?")).not.toBeInTheDocument()
    })
    expect(deleteSpy).not.toHaveBeenCalled()
    expect(screen.getAllByText(/Inicio:/)).toHaveLength(1)
    expect(getSpy).toHaveBeenCalledTimes(1)
  })

  it("navega al editor del bloque al pulsar Editar", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([
      { id: "1", mentorId: "m1", startAt: "2026-10-13T14:00:00Z", endAt: "2026-10-13T16:00:00Z", state: "free" as const, createdAt: "", updatedAt: "" },
    ])
    const user = userEvent.setup()

    render(<MentorAvailabilityView />)

    await user.click(await screen.findByRole("button", { name: "Editar bloque" }))

    expect(push).toHaveBeenCalledWith("/mentor/availability/1/edit")
  })
})
