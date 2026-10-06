import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import HomePage from "./page";

function getLinkHref(name: RegExp): string | null {
  return screen.getByRole("link", { name }).getAttribute("href");
}

describe("Home Page", () => {
  afterEach(cleanup);

  it("muestra el título y el subtítulo del Epic 3", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Epic 3 · Radar de Afinidad" }),
    ).toBeDefined();
    expect(screen.getByText("Entorno de revisión para QA · datos estáticos")).toBeDefined();
  });

  it("enlaza las pantallas de la HU-4", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 2, name: "HU-4 · Detalle por área" })).toBeDefined();
    expect(getLinkHref(/Interacción completa.*H4-03 a H4-05/)).toBe(
      "/area-detail-interaction-preview",
    );
    expect(getLinkHref(/Panel de detalle.*H4-01 y H4-02/)).toBe("/area-detail-preview");
  });

  it("enlaza la pantalla de la HU-2", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 2, name: "HU-2 · Cola de revisión" })).toBeDefined();
    expect(getLinkHref(/Cola de revisión.*H2-01/)).toBe("/radar-afinidad/cola-revision");
  });

  it("muestra la HU-1 y la HU-3 deshabilitadas y sin enlace", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 2, name: "HU-1" })).toBeDefined();
    expect(screen.getByRole("heading", { level: 2, name: "HU-3" })).toBeDefined();

    const pending = screen.getAllByText("Pendiente de integración");

    expect(pending).toHaveLength(2);
    pending.forEach((card) => {
      expect(card.getAttribute("aria-disabled")).toBe("true");
      expect(card.closest("a")).toBeNull();
    });
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });
});
