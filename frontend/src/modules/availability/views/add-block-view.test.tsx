import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { AddBlockView } from "./add-block-view"
import { availabilityApi } from "../services/availability.api"
import type { AvailabilityBlock } from "../types/availability"

const push = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}))

// Ahora fijo: jueves 8 de octubre de 2026, 10:00 en Bolivia (14:00 UTC).
const FIXED_NOW = new Date("2026-10-08T14:00:00Z")

const savedBlock: AvailabilityBlock = {
  id: "1",
  mentorId: "m1",
  startAt: "2026-10-13T22:00:00.000Z",
  endAt: "2026-10-14T00:00:00.000Z",
  state: "free",
  createdAt: "",
  updatedAt: "",
}

async function fillAndSave(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "martes, 13 de octubre de 2026" }))
  await user.selectOptions(screen.getByLabelText(/Hora de inicio/), "18:00")
  await user.selectOptions(screen.getByLabelText(/Hora de fin/), "20:00")
  await user.click(screen.getByRole("button", { name: "Guardar bloque" }))
}

describe("AddBlockView", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    push.mockClear()
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(FIXED_NOW)
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it("renderiza el encabezado y el formulario de nuevo bloque sin pedir datos", () => {
    const getSpy = vi.spyOn(availabilityApi, "getAvailabilityBlocks")

    render(<AddBlockView />)

    expect(screen.getByText("Mentorías / Mi disponibilidad")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Agregar bloque" })).toBeInTheDocument()
    expect(screen.getByText("Nuevo bloque de disponibilidad")).toBeInTheDocument()
    expect(getSpy).not.toHaveBeenCalled()
  })

  it("Cancelar vuelve a Mi disponibilidad sin llamar a la API", async () => {
    const createSpy = vi.spyOn(availabilityApi, "createAvailabilityBlock")
    render(<AddBlockView />)
    const user = userEvent.setup()

    await user.click(screen.getByRole("button", { name: "martes, 13 de octubre de 2026" }))
    await user.click(screen.getByRole("button", { name: "Cancelar" }))

    expect(push).toHaveBeenCalledWith("/mentor/availability")
    expect(createSpy).not.toHaveBeenCalled()
  })

  it("guarda el bloque en UTC, muestra el mensaje y limpia el formulario", async () => {
    const createSpy = vi.spyOn(availabilityApi, "createAvailabilityBlock").mockResolvedValue(savedBlock)
    render(<AddBlockView />)
    const user = userEvent.setup()

    await fillAndSave(user)

    await waitFor(() => {
      expect(screen.getByText("Bloque guardado correctamente.")).toBeInTheDocument()
    })
    expect(createSpy).toHaveBeenCalledWith({
      startAt: "2026-10-13T22:00:00.000Z",
      endAt: "2026-10-14T00:00:00.000Z",
    })
    expect(screen.getByLabelText(/Hora de inicio/)).toHaveValue("")
    expect(screen.getByLabelText(/Hora de fin/)).toHaveValue("")
  })

  it("muestra el error cuando falla el guardado", async () => {
    vi.spyOn(availabilityApi, "createAvailabilityBlock").mockRejectedValue(new Error("Network error"))
    render(<AddBlockView />)
    const user = userEvent.setup()

    await fillAndSave(user)

    await waitFor(() => {
      expect(screen.getByText("Error al crear el bloque de disponibilidad")).toBeInTheDocument()
    })
    expect(screen.queryByText("Bloque guardado correctamente.")).not.toBeInTheDocument()
  })
})
