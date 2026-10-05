import { render, screen, waitFor, cleanup, fireEvent, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { MentorAvailabilityView } from "./mentor-availability-view"
import { availabilityApi } from "../services/availability.api"
import type { AvailabilityBlock } from "../types/availability-block.types"

const NOW = new Date("2026-10-07T15:00:00.000Z")

const blockAt = (id: string, startAt: string, endAt: string): AvailabilityBlock => ({
  id,
  mentorId: "m1",
  startAt,
  endAt,
  state: "free",
  createdAt: "",
  updatedAt: "",
})

const lastRequestedRange = () => vi.mocked(availabilityApi.getAvailabilityBlocks).mock.lastCall?.[0]

describe("MentorAvailabilityView", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers({ toFake: ["Date"], now: NOW })
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it("muestra el skeleton mientras carga", () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockImplementation(
      () => new Promise(() => {}),
    )

    render(<MentorAvailabilityView />)

    expect(screen.getByText("Cargando disponibilidad...")).toBeInTheDocument()
  })

  it("empieza en la semana actual de Bolivia", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])

    render(<MentorAvailabilityView />)

    expect(screen.getByText("5 oct - 11 oct 2026")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Hoy" })).toBeDisabled()
    await waitFor(() =>
      expect(lastRequestedRange()).toEqual({
        from: "2026-10-05T04:00:00.000Z",
        to: "2026-10-12T03:59:59.999Z",
      }),
    )
  })

  it("las flechas cambian de semana y piden sus bloques", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])
    render(<MentorAvailabilityView />)

    fireEvent.click(screen.getByRole("button", { name: "Semana siguiente" }))
    expect(screen.getByText("12 oct - 18 oct 2026")).toBeInTheDocument()
    await waitFor(() => expect(lastRequestedRange()?.from).toBe("2026-10-12T04:00:00.000Z"))

    fireEvent.click(screen.getByRole("button", { name: "Semana anterior" }))
    fireEvent.click(screen.getByRole("button", { name: "Semana anterior" }))
    expect(screen.getByText("28 sep - 4 oct 2026")).toBeInTheDocument()
    await waitFor(() => expect(lastRequestedRange()?.from).toBe("2026-09-28T04:00:00.000Z"))
  })

  it("Hoy vuelve a la semana actual", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])
    render(<MentorAvailabilityView />)

    fireEvent.click(screen.getByRole("button", { name: "Semana siguiente" }))
    fireEvent.click(screen.getByRole("button", { name: "Semana siguiente" }))
    const todayButton = screen.getByRole("button", { name: "Hoy" })
    expect(todayButton).toBeEnabled()

    fireEvent.click(todayButton)

    expect(screen.getByText("5 oct - 11 oct 2026")).toBeInTheDocument()
    expect(todayButton).toBeDisabled()
    await waitFor(() => expect(lastRequestedRange()?.from).toBe("2026-10-05T04:00:00.000Z"))
  })

  it("solo muestra los bloques de la semana visible", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([
      blockAt("in-week", "2026-10-06T14:00:00.000Z", "2026-10-06T15:00:00.000Z"),
      blockAt("next-week", "2026-10-13T14:00:00.000Z", "2026-10-13T15:00:00.000Z"),
    ])

    render(<MentorAvailabilityView />)

    const grid = await screen.findByRole("region", { name: "Disponibilidad semanal" })
    expect(within(grid).getAllByRole("button", { name: /^libre,/ })).toHaveLength(1)
    expect(within(grid).getByRole("button", { name: "libre, 10:00 a 11:00" })).toBeInTheDocument()
  })

  it("muestra el estado vacío con el botón Nuevo bloque", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([])

    render(<MentorAvailabilityView />)

    const message = await screen.findByText("Aún no registraste bloques esta semana")
    const emptyState = message.closest("section") as HTMLElement
    expect(within(emptyState).getByRole("link", { name: "Nuevo bloque" })).toHaveAttribute(
      "href",
      "/mentor/availability/new",
    )
  })

  it("muestra el error si falla la consulta", async () => {
    vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockRejectedValue(new Error("Network error"))

    render(<MentorAvailabilityView />)

    expect(
      await screen.findByText("Error al obtener los bloques de disponibilidad"),
    ).toBeInTheDocument()
  })

  it("al hacer clic en un bloque libre abre el modal y lo elimina al confirmar", async () => {
    const user = userEvent.setup()
    const blockA = blockAt("a", "2026-10-06T14:00:00.000Z", "2026-10-06T15:00:00.000Z")
    const blockB = blockAt("b", "2026-10-07T18:00:00.000Z", "2026-10-07T19:00:00.000Z")
    const getSpy = vi.spyOn(availabilityApi, "getAvailabilityBlocks")
    getSpy.mockResolvedValueOnce([blockA, blockB]).mockResolvedValue([blockB])
    const deleteSpy = vi
      .spyOn(availabilityApi, "deleteAvailabilityBlock")
      .mockResolvedValue(undefined)

    render(<MentorAvailabilityView />)

    await user.click(await screen.findByRole("button", { name: "libre, 10:00 a 11:00" }))
    const dialog = await screen.findByRole("alertdialog")
    expect(within(dialog).getByText("¿Eliminar este bloque?")).toBeInTheDocument()

    await user.click(within(dialog).getByRole("button", { name: "Eliminar bloque" }))

    await waitFor(() => expect(deleteSpy).toHaveBeenCalledWith("a"))
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument())
    await waitFor(() => expect(screen.getAllByRole("button", { name: /^libre,/ })).toHaveLength(1))
    expect(getSpy).toHaveBeenCalledTimes(2)
  })

  it("cancelar el modal cierra sin eliminar y conserva los bloques", async () => {
    const user = userEvent.setup()
    const block = blockAt("a", "2026-10-06T14:00:00.000Z", "2026-10-06T15:00:00.000Z")
    const getSpy = vi.spyOn(availabilityApi, "getAvailabilityBlocks").mockResolvedValue([block])
    const deleteSpy = vi
      .spyOn(availabilityApi, "deleteAvailabilityBlock")
      .mockResolvedValue(undefined)

    render(<MentorAvailabilityView />)

    await user.click(await screen.findByRole("button", { name: "libre, 10:00 a 11:00" }))
    const dialog = await screen.findByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Cancelar" }))

    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument())
    expect(deleteSpy).not.toHaveBeenCalled()
    expect(screen.getByRole("button", { name: "libre, 10:00 a 11:00" })).toBeInTheDocument()
    expect(getSpy).toHaveBeenCalledTimes(1)
  })
})
