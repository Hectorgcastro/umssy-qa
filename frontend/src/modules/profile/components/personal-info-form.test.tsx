import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EMPTY_PERSONAL_INFO_VALUES } from "../config/profile-form-defaults.config";
import type { PersonalInfoValues } from "../types/personal-info-values.types";
import { PersonalInfoForm } from "./personal-info-form";

const CITIES = [
  { id: "city-cbba", title: "Cochabamba" },
  { id: "city-lpz", title: "La Paz" },
];

const SAVED_VALUES: PersonalInfoValues = {
  firstName: "Valeria",
  lastName: "Quispe",
  cityId: "city-cbba",
  phone: "+591 70000000",
  personalEmail: "valeria@correo.com",
};

function renderForm(initialValues = EMPTY_PERSONAL_INFO_VALUES, isSaving = false) {
  const onSubmit = vi.fn();
  render(
    <PersonalInfoForm
      initialValues={initialValues}
      cities={CITIES}
      isSaving={isSaving}
      onSubmit={onSubmit}
    />,
  );
  return { onSubmit, user: userEvent.setup() };
}

describe("PersonalInfoForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the personal information card with all the fields", () => {
    renderForm();

    expect(screen.getByText("Tu información personal")).toBeInTheDocument();
    expect(screen.getByText("Fotografía de perfil")).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombres/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellidos/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo personal/)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Cochabamba" })).toBeInTheDocument();
    expect(screen.getByText("* Campos obligatorios")).toBeInTheDocument();
  });

  it("shows the initial values", () => {
    renderForm(SAVED_VALUES);

    expect(screen.getByLabelText(/Nombres/)).toHaveValue("Valeria");
    expect(screen.getByLabelText(/Ciudad de residencia/)).toHaveValue("city-cbba");
    expect(screen.getByLabelText(/Correo personal/)).toHaveValue("valeria@correo.com");
  });

  it("submits the trimmed values", async () => {
    const { onSubmit, user } = renderForm();

    await user.type(screen.getByLabelText(/Nombres/), "  Valeria ");
    await user.type(screen.getByLabelText(/Apellidos/), "Quispe");
    await user.selectOptions(screen.getByLabelText(/Ciudad de residencia/), "city-lpz");
    await user.type(screen.getByLabelText(/Teléfono/), "+591 71234567");
    await user.type(screen.getByLabelText(/Correo personal/), "valeria@correo.com");
    await user.click(screen.getByRole("button", { name: "Guardar perfil" }));

    expect(onSubmit).toHaveBeenCalledWith({
      firstName: "Valeria",
      lastName: "Quispe",
      cityId: "city-lpz",
      phone: "+591 71234567",
      personalEmail: "valeria@correo.com",
    });
  });

  it("restores the initial values when cancelling", async () => {
    const { user } = renderForm(SAVED_VALUES);

    await user.clear(screen.getByLabelText(/Nombres/));
    await user.type(screen.getByLabelText(/Nombres/), "Another name");
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByLabelText(/Nombres/)).toHaveValue("Valeria");
  });

  it("disables the form while saving", () => {
    renderForm(SAVED_VALUES, true);

    expect(screen.getByLabelText(/Nombres/)).toBeDisabled();
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
  });
});
