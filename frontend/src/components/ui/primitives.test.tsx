import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { Input } from "./input"
import { Separator } from "./separator"
import { Skeleton } from "./skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

describe("UI primitives", () => {
  afterEach(() => cleanup())

  it("renders an input with its type", () => {
    render(<Input type="email" placeholder="Correo" />)
    expect(screen.getByPlaceholderText("Correo")).toHaveAttribute("type", "email")
  })

  it("renders horizontal and vertical separators", () => {
    render(
      <>
        <Separator />
        <Separator orientation="vertical" />
      </>
    )
    expect(document.querySelectorAll('[data-slot="separator"]')).toHaveLength(2)
  })

  it("renders a skeleton", () => {
    render(<Skeleton className="h-4" />)
    expect(document.querySelector('[data-slot="skeleton"]')).not.toBeNull()
  })

  it("renders an open tooltip", async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Ayuda</TooltipTrigger>
          <TooltipContent>Texto de ayuda</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(await screen.findByText("Texto de ayuda")).toBeInTheDocument()
  })
})
