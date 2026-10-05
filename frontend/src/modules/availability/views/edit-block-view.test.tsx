import { render, screen, waitFor, cleanup, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { EditBlockView } from "./edit-block-view"
import { availabilityApi } from "../services/availability.api"

const push = vi.fn()
const routeParams = { id: "1" }
const WEEK_START = "2030-05-11T04:00:00.000Z"
const BACK_PATH = "/mentor/availability?week=2030-05-11T04%3A00%3A00.000Z"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useParams: () => routeParams,
}))

const mockBlock = {
  id: "1",
  mentorId: "m1",
  startAt: "2030-05-13T14:00:00Z",
  endAt: "2030-05-13T16:00:00Z",
  state: "free" as const,
  createdAt: "",
  updatedAt: "",
}

describe("EditBlockView", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    push.mockClear()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it("muestra el estado de carga inicial", () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockImplementation(
      () => new Promise(() => {})
    )

    render(<EditBlockView />)

    expect(screen.getByText("Cargando disponibilidad...")).toBeInTheDocument()
  })

  it("muestra el formulario en modo edición con los datos del bloque", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([mockBlock])

    render(<EditBlockView />)

    expect(await screen.findByText("Editar bloque")).toBeInTheDocument()
    expect(screen.getByText("Modifica la fecha o el horario del bloque.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument()
    expect(screen.getByDisplayValue("10:00")).toBeInTheDocument()
    expect(screen.getByDisplayValue("12:00")).toBeInTheDocument()
  })

  it("guarda los cambios y vuelve a la lista", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([mockBlock])
    const updateSpy = vi
      .spyOn(availabilityApi, "updateAvailabilityBlock")
      .mockResolvedValue({ ...mockBlock, endAt: "2030-05-13T18:00:00.000Z" })
    const user = userEvent.setup()

    render(<EditBlockView initialWeekStart={WEEK_START} />)
    await screen.findByText("Editar bloque")

    await user.click(screen.getByRole("button", { name: "Guardar cambios" }))

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith("1", {
        startAt: "2030-05-13T14:00:00.000Z",
        endAt: "2030-05-13T16:00:00.000Z",
      })
    })
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith(BACK_PATH)
    })
  })

  it("muestra el detalle del backend (409) y no navega", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([mockBlock])
    vi.spyOn(availabilityApi, "updateAvailabilityBlock").mockRejectedValue({
      response: { data: { statusCode: 409, detail: "Los bloques de disponibilidad se solapan", ok: false } },
    })
    const user = userEvent.setup()

    render(<EditBlockView />)
    await screen.findByText("Editar bloque")

    await user.click(screen.getByRole("button", { name: "Guardar cambios" }))

    expect(
      await screen.findByText("Los bloques de disponibilidad se solapan")
    ).toBeInTheDocument()
    expect(push).not.toHaveBeenCalled()
  })

  it("muestra error cuando el bloque no existe en la lista", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])

    render(<EditBlockView />)

    expect(
      await screen.findByText("No se pudo cargar el bloque de disponibilidad")
    ).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Guardar cambios" })).not.toBeInTheDocument()
  })

  it("muestra error cuando falla la carga de los bloques", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockRejectedValue(new Error("Network error"))

    render(<EditBlockView />)

    expect(
      await screen.findByText("Error al obtener los bloques de disponibilidad")
    ).toBeInTheDocument()
  })

  it("cancelar vuelve a la lista sin guardar", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([mockBlock])
    const updateSpy = vi.spyOn(availabilityApi, "updateAvailabilityBlock")
    const user = userEvent.setup()

    render(<EditBlockView initialWeekStart={WEEK_START} />)
    await screen.findByText("Editar bloque")

    await user.click(screen.getByRole("button", { name: "Cancelar" }))

    expect(push).toHaveBeenCalledWith(BACK_PATH)
    expect(updateSpy).not.toHaveBeenCalled()
  })

  it("elimina el bloque y vuelve a la lista", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([mockBlock])
    const deleteSpy = vi
      .spyOn(availabilityApi, "deleteAvailabilityBlock")
      .mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<EditBlockView initialWeekStart={WEEK_START} />)
    await screen.findByText("Editar bloque")

    await user.click(screen.getByRole("button", { name: "Eliminar este bloque" }))
    const dialog = await screen.findByRole("alertdialog")
    expect(within(dialog).getByText("¿Eliminar este bloque?")).toBeInTheDocument()

    await user.click(within(dialog).getByRole("button", { name: "Eliminar bloque" }))

    await waitFor(() => expect(deleteSpy).toHaveBeenCalledWith("1"))
    await waitFor(() => expect(push).toHaveBeenCalledWith(BACK_PATH))
  })

  it("cancelar el diálogo de eliminar conserva el bloque", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([mockBlock])
    const deleteSpy = vi
      .spyOn(availabilityApi, "deleteAvailabilityBlock")
      .mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<EditBlockView initialWeekStart={WEEK_START} />)
    await screen.findByText("Editar bloque")

    await user.click(screen.getByRole("button", { name: "Eliminar este bloque" }))
    const dialog = await screen.findByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Cancelar" }))

    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument())
    expect(deleteSpy).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
    expect(screen.getByText("Editar bloque")).toBeInTheDocument()
  })
})
