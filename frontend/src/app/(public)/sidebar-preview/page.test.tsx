import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { stubMatchMedia } from "@/shared/testing/stub-match-media";
import SidebarPreviewPage from "./page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/sidebar-preview",
}));

describe("SidebarPreviewPage", () => {
  beforeEach(() => {
    stubMatchMedia();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the sidebar with the sample content", () => {
    render(<SidebarPreviewPage />);

    expect(screen.getByText("UMSSY")).toBeDefined();
    expect(screen.getByRole("heading", { name: "Vista previa del menú lateral" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Cerrar menú" })).toBeDefined();
  });

  it("shows the example items with the current page marked", () => {
    render(<SidebarPreviewPage />);

    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Notificaciones" }).getAttribute("aria-current")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Mi perfil" }));
    expect(screen.getByRole("link", { name: "Datos personales" })).toBeDefined();
  });
});
