import type { ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HomePage from "./page";

vi.mock("@/modules/radar-chart/components/epic3-shell", () => ({
  Epic3Shell: ({ children }: { children: ReactNode }) => children,
}));

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
    expect(getLinkHref(/Cola de revisión.*H2-01 a H2-05/)).toBe("/affinity-radar/review-queue");
  });

  it("enlaza la pantalla de la HU-1", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 2, name: "HU-1 · Radar de afinidad del egresado" }),
    ).toBeDefined();
    expect(getLinkHref(/Radar de afinidad.*H1-01 a H1-05/)).toBe("/perfil/radar");
  });

  it("muestra la HU-3 deshabilitada y sin enlace", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 2, name: "HU-3" })).toBeDefined();

    const pending = screen.getByText("Pendiente de integración");

    expect(pending.getAttribute("aria-disabled")).toBe("true");
    expect(pending.closest("a")).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });
});
