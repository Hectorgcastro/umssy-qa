import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { AccessRequestSidebar } from "./access-request-sidebar"

afterEach(() => {
  cleanup()
})

describe("AccessRequestSidebar", () => {
  it("renders the four request steps", () => {
    render(<AccessRequestSidebar />)

    expect(screen.getByText("Tus datos")).toBeInTheDocument()
    expect(screen.getByText("Documento de respaldo")).toBeInTheDocument()
    expect(screen.getByText("Revisión de la carrera")).toBeInTheDocument()
    expect(screen.getByText("Activación de cuenta")).toBeInTheDocument()
  })

  it("renders the request access heading", () => {
    render(<AccessRequestSidebar />)

    expect(screen.getByText("Solicitud de acceso")).toBeInTheDocument()
  })
})