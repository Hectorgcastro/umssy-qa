import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

describe("Sheet", () => {
  afterEach(() => cleanup())

  it("renders its content when open", async () => {
    render(
      <Sheet open>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Titulo</SheetTitle>
            <SheetDescription>Descripcion</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>Cerrar</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )

    expect(await screen.findByText("Titulo")).toBeInTheDocument()
    expect(screen.getByText("Descripcion")).toBeInTheDocument()
    expect(screen.getByText("Cerrar")).toBeInTheDocument()
  })
})
