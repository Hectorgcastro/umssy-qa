import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RequestAccessView } from "./request-access-view";

describe("RequestAccessView", () => {
  afterEach(() => cleanup());

  it("renderiza la barra de pasos y el formulario del paso 1", () => {
    render(<RequestAccessView />);

    expect(screen.getByRole("navigation", { name: "Pasos de la solicitud" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Solicita tu acceso a la comunidad" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")[0]).toHaveAttribute("aria-current", "step");
  });

  it("apila la barra arriba por debajo de lg y la pone al lado desde lg", () => {
    const { container } = render(<RequestAccessView />);

    const layout = container.querySelector("main > div");
    expect(layout).toHaveClass("flex", "min-h-screen", "flex-col", "lg:flex-row");
  });

  it("deja el formulario ocupando el espacio restante y centrado verticalmente", () => {
    const { container } = render(<RequestAccessView />);

    const section = container.querySelector("section");
    expect(section).toHaveClass("flex-1", "flex-col", "justify-center");
  });

  it("centra horizontalmente el contenido con un ancho máximo", () => {
    const { container } = render(<RequestAccessView />);

    const wrapper = container.querySelector("section > div");
    expect(wrapper).toHaveClass("mx-auto", "w-full", "max-w-3xl");
    expect(wrapper).toContainElement(screen.getByRole("heading", { name: "Solicita tu acceso a la comunidad" }));
  });
});
