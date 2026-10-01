import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { reportsService } from "../services/reports.service";
import { RegisteredUsersReportView } from "./registered-users-report-view";

async function renderLoadedView() {
  render(<RegisteredUsersReportView />);
  await waitFor(() => {
    expect(screen.getByText("Juan Carlos Peres Rojas")).toBeDefined();
  });
}

function selectUserType(label: string) {
  fireEvent.click(screen.getByRole("combobox", { name: "Tipo de usuario" }));
  fireEvent.click(screen.getByRole("option", { name: label }));
}

describe("RegisteredUsersReportView", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("muestra el título, los botones y la primera página de usuarios", async () => {
    render(<RegisteredUsersReportView />);

    expect(screen.getByRole("heading", { name: "Reporte de usuarios registrados" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Exportar CSV" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Gestión" })).toBeDefined();
    expect(screen.getByRole("button", { name: "actualizar" })).toBeDefined();
    expect(screen.getByText("Cargando usuarios...")).toBeDefined();
    expect(screen.getAllByTestId("skeleton-row")).toHaveLength(5);

    await waitFor(() => {
      expect(screen.getByText("Juan Carlos Peres Rojas")).toBeDefined();
    });
    expect(screen.getByText("jc.peraz@gmail.com")).toBeDefined();
    expect(screen.getAllByText("Título académico").length).toBeGreaterThan(0);
    expect(screen.getAllByText("15/03/2026").length).toBeGreaterThan(0);
    expect(screen.getByText("Mostrando 1-10 de 24 usuarios")).toBeDefined();
    expect(screen.getByRole("button", { name: "Página 3" })).toBeDefined();
  });

  it("ofrece las opciones de tipo de usuario en orden", () => {
    render(<RegisteredUsersReportView />);

    expect(screen.queryByRole("listbox")).toBeNull();
    fireEvent.click(screen.getByRole("combobox", { name: "Tipo de usuario" }));

    const options = screen.getAllByRole("option").map((option) => option.textContent);
    expect(options).toEqual(["Todos", "Estudiante", "Titulado", "Mentor", "Empresa", "Administrador"]);
  });

  it("vuelve a cargar los datos al presionar actualizar", async () => {
    const getRegisteredUsersSpy = vi.spyOn(reportsService, "getRegisteredUsers");
    await renderLoadedView();

    fireEvent.click(screen.getByRole("button", { name: "actualizar" }));

    expect(screen.getByRole<HTMLButtonElement>("button", { name: "actualizar" }).disabled).toBe(true);
    await waitFor(() => {
      expect(screen.getByText("Juan Carlos Peres Rojas")).toBeDefined();
    });
    expect(getRegisteredUsersSpy).toHaveBeenCalledTimes(2);
  });

  it("navega a la última página", async () => {
    await renderLoadedView();

    fireEvent.click(screen.getByRole("button", { name: "Página 3" }));

    await waitFor(() => {
      expect(screen.getByText("Camila Vargas Orellana")).toBeDefined();
    });
    expect(screen.getByText("Mostrando 21-24 de 24 usuarios")).toBeDefined();
  });

  it("filtra por tipo de usuario y vuelve a la primera página", async () => {
    await renderLoadedView();

    fireEvent.click(screen.getByRole("button", { name: "Página 2" }));
    await waitFor(() => {
      expect(screen.getByText("Mostrando 11-20 de 24 usuarios")).toBeDefined();
    });

    selectUserType("Empresa");

    await waitFor(() => {
      expect(screen.getByText("Mostrando 1-4 de 4 usuarios")).toBeDefined();
    });
    expect(screen.getByText("Diego Mercado Rocha")).toBeDefined();
    expect(screen.queryByText("Juan Carlos Peres Rojas")).toBeNull();
    expect(screen.getByRole("combobox", { name: "Tipo de usuario" }).textContent).toContain("Empresa");

    selectUserType("Mentor");
    await waitFor(() => {
      expect(screen.getByText("Mostrando 1-2 de 2 usuarios")).toBeDefined();
    });
    expect(screen.getByText("Gabriela Soliz Arnez")).toBeDefined();

    selectUserType("Todos");
    await waitFor(() => {
      expect(screen.getByText("Mostrando 1-10 de 24 usuarios")).toBeDefined();
    });
  });

  it("maneja el filtro con el teclado y lo cierra con Escape o al hacer clic afuera", async () => {
    await renderLoadedView();
    const combobox = screen.getByRole("combobox", { name: "Tipo de usuario" });

    fireEvent.keyDown(combobox, { key: "ArrowDown" });
    expect(combobox.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(combobox, { key: "ArrowDown" });
    fireEvent.keyDown(combobox, { key: "ArrowDown" });
    fireEvent.keyDown(combobox, { key: "ArrowUp" });
    fireEvent.keyDown(combobox, { key: "Enter" });

    expect(combobox.getAttribute("aria-expanded")).toBe("false");
    await waitFor(() => {
      expect(combobox.textContent).toContain("Estudiante");
    });

    fireEvent.keyDown(combobox, { key: " " });
    expect(screen.getByRole("listbox")).toBeDefined();
    fireEvent.keyDown(combobox, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();

    fireEvent.click(combobox);
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("no vuelve a consultar si se elige la misma opción", async () => {
    const getRegisteredUsersSpy = vi.spyOn(reportsService, "getRegisteredUsers");
    await renderLoadedView();

    selectUserType("Todos");

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(getRegisteredUsersSpy).toHaveBeenCalledTimes(1);
  });

  it("muestra un mensaje cuando no hay usuarios", async () => {
    vi.spyOn(reportsService, "getRegisteredUsers").mockResolvedValueOnce({
      statusCode: 200,
      data: { items: [], totalItems: 0 },
      detail: "Sin datos",
      ok: true,
    });

    render(<RegisteredUsersReportView />);

    await waitFor(() => {
      expect(screen.getByText("No hay usuarios registrados para este filtro.")).toBeDefined();
    });
    expect(screen.getByText("Mostrando 0-0 de 0 usuarios")).toBeDefined();
  });

  it("muestra un mensaje de error si falla la carga", async () => {
    vi.spyOn(reportsService, "getRegisteredUsers").mockRejectedValueOnce(new Error("Network error"));

    render(<RegisteredUsersReportView />);

    await waitFor(() => {
      expect(screen.getByText("No se pudo cargar el reporte de usuarios registrados.")).toBeDefined();
    });
  });
});
