import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { RequestAccessView } from "./request-access-view"

afterEach(() => {
  cleanup()
})

describe("RequestAccessView", () => {
  it("renders the sidebar and personal data form", () => {
    render(<RequestAccessView />)

    expect(screen.getByText("Solicitud de acceso")).toBeInTheDocument()
    expect(screen.getByText("Tus datos personales")).toBeInTheDocument()
    expect(
      screen.getByRole("button", {
        name: "Continuar al siguiente paso",
      })
    ).toBeInTheDocument()
  })
})