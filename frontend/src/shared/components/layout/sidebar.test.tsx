import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Sidebar } from "./sidebar";

const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

const USER = { fullName: "Alejandro Vargas", role: "Administrador" };

describe("Sidebar", () => {
  afterEach(() => {
    cleanup();
    mockUsePathname.mockReset();
  });

  it("renderiza la marca, los ítems principales y la tarjeta del usuario", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<Sidebar user={USER} />);

    expect(screen.getByText("UMSSY")).toBeDefined();
    expect(screen.getByRole("link", { name: "Inicio" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Solicitudes" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Registro de auditoría" })).toBeDefined();
    expect(screen.getByText("Alejandro Vargas")).toBeDefined();
    expect(screen.getByText("AV")).toBeDefined();
  });

  it("marca como actual el ítem de la ruta activa", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<Sidebar user={USER} />);

    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Solicitudes" }).getAttribute("aria-current")).toBeNull();
  });

  it("abre el submenú de reportes cuando la ruta activa es un reporte", () => {
    mockUsePathname.mockReturnValue("/reports/registered-users");
    render(<Sidebar user={USER} />);

    const toggle = screen.getByRole("button", { name: "Reportes Analíticos" });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    const activeChild = screen.getByRole("link", { name: "Reporte de usuarios registrados" });
    expect(activeChild.getAttribute("aria-current")).toBe("page");
    expect(
      screen.getByRole("link", { name: "Reporte de usuarios rechazados" }).getAttribute("aria-current"),
    ).toBeNull();
  });

  it("alterna el submenú al hacer clic en el grupo", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<Sidebar user={USER} />);

    const toggle = screen.getByRole("button", { name: "Reportes Analíticos" });
    expect(screen.queryByRole("link", { name: "Historial de reportes generados" })).toBeNull();

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "Historial de reportes generados" })).toBeDefined();

    fireEvent.click(toggle);
    expect(screen.queryByRole("link", { name: "Historial de reportes generados" })).toBeNull();
  });

  it("muestra la foto del usuario cuando tiene avatar", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<Sidebar user={{ ...USER, avatarUrl: "/avatar.png" }} />);

    expect(screen.getByAltText("Foto de Alejandro Vargas")).toBeDefined();
  });
});
