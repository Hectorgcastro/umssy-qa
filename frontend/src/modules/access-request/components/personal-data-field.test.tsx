import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PersonalDataField } from "./personal-data-field";

describe("PersonalDataField", () => {
  afterEach(() => cleanup());

  it("asocia la etiqueta con el campo y usa el id como name", () => {
    render(<PersonalDataField id="firstName" label="Nombres" />);

    const input = screen.getByLabelText("Nombres");
    expect(input).toHaveAttribute("id", "firstName");
    expect(input).toHaveAttribute("name", "firstName");
  });

  it("muestra el texto de ayuda y lo vincula con aria-describedby", () => {
    render(<PersonalDataField id="sisCode" label="Código SIS" help="Figura en tu kárdex." />);

    const help = screen.getByText("Figura en tu kárdex.");
    expect(screen.getByLabelText("Código SIS")).toHaveAttribute("aria-describedby", help.id);
  });

  it("no agrega aria-describedby ni ayuda si no hay texto de ayuda", () => {
    render(<PersonalDataField id="phone" label="Teléfono" />);

    expect(screen.getByLabelText("Teléfono")).not.toHaveAttribute("aria-describedby");
  });

  it("muestra el icono a la izquierda y deja espacio en el campo", () => {
    render(
      <PersonalDataField id="email" label="Correo" icon={<svg data-testid="icono" aria-hidden="true" />} />
    );

    expect(screen.getByTestId("icono")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo")).toHaveClass("pl-10");
  });

  it("aplica la altura, el borde y el foco de la paleta", () => {
    render(<PersonalDataField id="firstName" label="Nombres" />);

    const input = screen.getByLabelText("Nombres");
    expect(input).toHaveClass("h-[42px]", "2xl:h-12", "2xl:text-base", "rounded-md", "border-border", "focus-visible:border-accent");
    expect(input).not.toHaveClass("h-8");
  });

  it("reenvía las props del campo", () => {
    render(<PersonalDataField id="phone" label="Teléfono" maxLength={8} placeholder="Ej. 70712345" />);

    expect(screen.getByLabelText("Teléfono")).toHaveAttribute("maxlength", "8");
    expect(screen.getByPlaceholderText("Ej. 70712345")).toBeInTheDocument();
  });
});
