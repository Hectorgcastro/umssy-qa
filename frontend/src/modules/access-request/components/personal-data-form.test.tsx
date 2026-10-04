import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it } from "vitest"
import { PersonalDataForm } from "./personal-data-form"

afterEach(() => {
  cleanup()
})

describe("PersonalDataForm", () => {
  it("renders all personal data fields", () => {
    render(<PersonalDataForm />)

    expect(screen.getByLabelText(/Nombres/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Apellidos/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Carnet de identidad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Expedido/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Código SIS/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Fecha de nacimiento/i)).toBeInTheDocument()
    expect(
      screen.getByLabelText(/Año de ingreso a la UMSS/i)
    ).toBeInTheDocument()
  })

  it("renders the main actions", () => {
    render(<PersonalDataForm />)

    expect(
      screen.getByRole("link", { name: "Cancelar" })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", {
        name: "Continuar al siguiente paso",
      })
    ).toBeInTheDocument()
  })

  it("renders expedition options", async () => {
    const user = userEvent.setup()

    render(<PersonalDataForm />)

    await user.click(
      screen.getByRole("combobox", { name: /Expedido/i })
    )

    expect(
      await screen.findByRole("option", { name: "CB" })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("option", { name: "LP" })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("option", { name: "SC" })
    ).toBeInTheDocument()
  })
})