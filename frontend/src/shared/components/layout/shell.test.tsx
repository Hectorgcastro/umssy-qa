import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Shell } from "./shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

const USER = { fullName: "Alejandro Vargas", role: "Administrador" };

describe("Shell", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza el contenido de la página", () => {
    render(
      <Shell user={USER}>
        <p>Contenido de prueba</p>
      </Shell>,
    );

    expect(screen.getByText("Contenido de prueba")).toBeDefined();
  });

  it("abre y cierra el menú lateral en móvil", () => {
    render(
      <Shell user={USER}>
        <p>Contenido de prueba</p>
      </Shell>,
    );

    expect(screen.queryAllByRole("button", { name: "Cerrar menú" })).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));
    const closeButtons = screen.getAllByRole("button", { name: "Cerrar menú" });
    expect(closeButtons).toHaveLength(2);

    fireEvent.click(closeButtons[0]);
    expect(screen.queryAllByRole("button", { name: "Cerrar menú" })).toHaveLength(0);
  });

  it("cierra el menú móvil al navegar", () => {
    render(
      <Shell user={USER}>
        <p>Contenido de prueba</p>
      </Shell>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));
    const solicitudesLinks = screen.getAllByRole("link", { name: "Solicitudes" });
    fireEvent.click(solicitudesLinks[solicitudesLinks.length - 1]);

    expect(screen.queryAllByRole("button", { name: "Cerrar menú" })).toHaveLength(0);
  });
});
