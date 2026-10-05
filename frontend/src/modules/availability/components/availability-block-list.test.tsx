import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, it, expect, vi } from "vitest"
import { AvailabilityBlockList } from "./availability-block-list"
import type { AvailabilityBlock } from "../types/availability-block.types"

const mockBlock: AvailabilityBlock = {
  id: "1",
  mentorId: "m1",
  startAt: "2024-01-15T14:00:00Z",
  endAt: "2024-01-15T15:00:00Z",
  state: "free",
  createdAt: "",
  updatedAt: "",
}

describe("AvailabilityBlockList", () => {
  afterEach(() => {
    cleanup()
  })

  it("muestra el mensaje vacío cuando no hay bloques", () => {
    render(<AvailabilityBlockList blocks={[]} emptyMessage="Sin bloques" />)

    expect(screen.getByText("Sin bloques")).toBeInTheDocument()
    expect(screen.queryByRole("list")).not.toBeInTheDocument()
  })

  it("muestra inicio y fin de cada bloque con locale es-BO", () => {
    render(<AvailabilityBlockList blocks={[mockBlock]} emptyMessage="Sin bloques" />)

    expect(screen.getAllByRole("listitem")).toHaveLength(1)
    expect(
      screen.getByText(`Inicio: ${new Date(mockBlock.startAt).toLocaleString("es-BO")}`)
    ).toBeInTheDocument()
    expect(
      screen.getByText(`Fin: ${new Date(mockBlock.endAt).toLocaleString("es-BO")}`)
    ).toBeInTheDocument()
  })

  it("no muestra el botón de eliminar sin la propiedad onDelete", () => {
    render(<AvailabilityBlockList blocks={[mockBlock]} emptyMessage="Sin bloques" />)

    expect(
      screen.queryByRole("button", { name: "Eliminar bloque" })
    ).not.toBeInTheDocument()
  })

  it("muestra un botón de eliminar por bloque y notifica el bloque correcto", async () => {
    const user = userEvent.setup()
    const otherBlock: AvailabilityBlock = { ...mockBlock, id: "2" }
    const onDelete = vi.fn()

    render(
      <AvailabilityBlockList
        blocks={[mockBlock, otherBlock]}
        emptyMessage="Sin bloques"
        onDelete={onDelete}
      />
    )

    const buttons = screen.getAllByRole("button", { name: "Eliminar bloque" })
    expect(buttons).toHaveLength(2)

    await user.click(buttons[1])

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(otherBlock)
  })

  it("muestra el botón de editar y devuelve el bloque al pulsarlo", async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()

    render(<AvailabilityBlockList blocks={[mockBlock]} emptyMessage="Sin bloques" onEdit={onEdit} />)

    await user.click(screen.getByRole("button", { name: "Editar bloque" }))

    expect(onEdit).toHaveBeenCalledWith(mockBlock)
  })

  it("no muestra el botón de editar cuando no se pasa onEdit", () => {
    render(<AvailabilityBlockList blocks={[mockBlock]} emptyMessage="Sin bloques" />)

    expect(screen.queryByRole("button", { name: "Editar bloque" })).not.toBeInTheDocument()
  })
})
