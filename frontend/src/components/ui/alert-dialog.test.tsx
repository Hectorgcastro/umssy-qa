import { useState } from "react"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"

function ControlledDialog({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<button type="button" />}>Abrir</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar acción</AlertDialogTitle>
          <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe("AlertDialog", () => {
  afterEach(() => cleanup())

  it("no muestra el contenido hasta que se abre", () => {
    render(<ControlledDialog onConfirm={vi.fn()} />)

    expect(screen.queryByRole("alertdialog")).toBeNull()
  })

  it("se abre desde el disparador con título y descripción", async () => {
    const user = userEvent.setup()
    render(<ControlledDialog onConfirm={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: "Abrir" }))

    const dialog = await screen.findByRole("alertdialog")
    expect(dialog).toHaveAttribute("data-slot", "alert-dialog-content")
    expect(screen.getByText("Confirmar acción")).toBeInTheDocument()
    expect(screen.getByText("Esta acción no se puede deshacer.")).toBeInTheDocument()
  })

  it("cancelar cierra el diálogo sin ejecutar la acción", async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<ControlledDialog onConfirm={onConfirm} />)
    await user.click(screen.getByRole("button", { name: "Abrir" }))
    await screen.findByRole("alertdialog")

    await user.click(screen.getByRole("button", { name: "Cancelar" }))

    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("confirmar ejecuta la acción y cierra el diálogo", async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<ControlledDialog onConfirm={onConfirm} />)
    await user.click(screen.getByRole("button", { name: "Abrir" }))
    await screen.findByRole("alertdialog")

    await user.click(screen.getByRole("button", { name: "Confirmar" }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
  })

  it("marca los botones de cancelar y confirmar con su data-slot", async () => {
    const user = userEvent.setup()
    render(<ControlledDialog onConfirm={vi.fn()} />)
    await user.click(screen.getByRole("button", { name: "Abrir" }))
    await screen.findByRole("alertdialog")

    expect(screen.getByRole("button", { name: "Cancelar" })).toHaveAttribute("data-slot", "alert-dialog-cancel")
    expect(screen.getByRole("button", { name: "Confirmar" })).toHaveAttribute("data-slot", "alert-dialog-action")
  })
})
