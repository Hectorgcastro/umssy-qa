import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RequestStepsSidebar } from "./request-steps-sidebar";

describe("RequestStepsSidebar", () => {
  afterEach(() => cleanup());

  it("muestra el título y el subtítulo", () => {
    render(<RequestStepsSidebar />);

    expect(screen.getByRole("heading", { name: "Solicitud de acceso" })).toBeInTheDocument();
    expect(
      screen.getByText("Cuatro pasos para unirte a la comunidad verificada de la carrera.")
    ).toBeInTheDocument();
  });

  it("muestra los 4 pasos con su descripción", () => {
    render(<RequestStepsSidebar />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Tus datos");
    expect(items[0]).toHaveTextContent("Quién eres y cómo contactarte");
    expect(items[1]).toHaveTextContent("Documento de respaldo");
    expect(items[1]).toHaveTextContent("Diploma académico o título en provisión nacional");
    expect(items[2]).toHaveTextContent("Revisión de la carrera");
    expect(items[2]).toHaveTextContent("Hasta 48 horas hábiles");
    expect(items[3]).toHaveTextContent("Activación de cuenta");
    expect(items[3]).toHaveTextContent("Código enviado a tu correo");
  });

  it("dibuja un conector entre cada par de pasos y ninguno tras el último", () => {
    render(<RequestStepsSidebar />);

    const items = screen.getAllByRole("listitem");
    items.slice(0, 3).forEach((item) => expect(item.querySelector('span[aria-hidden="true"]')).not.toBeNull());
    expect(items[3].querySelector('span[aria-hidden="true"]')).toBeNull();
  });

  it("resalta el primer paso por defecto con el círculo relleno de rojo y sin franja en la fila", () => {
    render(<RequestStepsSidebar />);

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("aria-current", "step");
    expect(items[0]).not.toHaveClass("bg-interaction");
    expect(screen.getByText("1")).toHaveClass("bg-accent", "text-surface");
    items.slice(1).forEach((item) => expect(item).not.toHaveAttribute("aria-current"));
    expect(screen.getByText("2")).not.toHaveClass("bg-accent");
    expect(screen.getByText("2")).toHaveClass("border-surface/35");
  });

  it("resalta el paso indicado", () => {
    render(<RequestStepsSidebar currentStep={3} />);

    const items = screen.getAllByRole("listitem");
    expect(items[2]).toHaveAttribute("aria-current", "step");
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(screen.getByText("3")).toHaveClass("bg-accent");
    expect(screen.getByText("1")).not.toHaveClass("bg-accent");
  });

  it("muestra en el pie el escudo dorado y el aviso de privacidad", () => {
    const { container } = render(<RequestStepsSidebar />);

    expect(
      screen.getByText(
        "Tus documentos se guardan cifrados y solo los revisa el personal autorizado de la carrera."
      )
    ).toBeInTheDocument();
    expect(container.querySelector("svg.text-gold")).not.toBeNull();
  });

  it("ocupa todo el ancho por debajo de lg y 380 px de alto completo desde lg", () => {
    const { container } = render(<RequestStepsSidebar />);

    const aside = container.querySelector("aside");
    expect(aside).toHaveClass("w-full", "lg:w-95", "2xl:w-110", "lg:min-h-screen");
    expect(aside?.className).not.toMatch(/\bmd:/);
  });

  it("no usa el término egresado", () => {
    const { container } = render(<RequestStepsSidebar />);

    expect(container.textContent).not.toMatch(/egres/i);
  });
});
