import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as downloadFileModule from "@/shared/utils/download-file";
import { reportsService } from "../services/reports.service";
import { RegisteredUsersReportView } from "./registered-users-report-view";

async function renderLoadedView() {
  render(<RegisteredUsersReportView />);
  await waitFor(() => {
    expect(screen.getByText("Juan Carlos Peres Rojas")).toBeDefined();
  });
}

// El Select de shadcn responde a eventos de puntero reales: se usa user-event.
async function selectUserType(user: UserEvent, label: string) {
  await user.click(screen.getByRole("combobox", { name: "Tipo de usuario" }));
  await user.click(await screen.findByRole("option", { name: label }));
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

  it("ofrece las opciones de tipo de usuario en orden", async () => {
    render(<RegisteredUsersReportView />);

    expect(screen.queryByRole("listbox")).toBeNull();
    await userEvent.setup().click(screen.getByRole("combobox", { name: "Tipo de usuario" }));

    await screen.findByRole("listbox");
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
    const user = userEvent.setup();
    await renderLoadedView();

    fireEvent.click(screen.getByRole("button", { name: "Página 2" }));
    await waitFor(() => {
      expect(screen.getByText("Mostrando 11-20 de 24 usuarios")).toBeDefined();
    });

    await selectUserType(user, "Empresa");

    await waitFor(() => {
      expect(screen.getByText("Mostrando 1-4 de 4 usuarios")).toBeDefined();
    });
    expect(screen.getByText("Diego Mercado Rocha")).toBeDefined();
    expect(screen.queryByText("Juan Carlos Peres Rojas")).toBeNull();
    expect(screen.getByRole("combobox", { name: "Tipo de usuario" }).textContent).toContain("Empresa");

    await selectUserType(user, "Mentor");
    await waitFor(() => {
      expect(screen.getByText("Mostrando 1-2 de 2 usuarios")).toBeDefined();
    });
    expect(screen.getByText("Gabriela Soliz Arnez")).toBeDefined();

    await selectUserType(user, "Todos");
    await waitFor(() => {
      expect(screen.getByText("Mostrando 1-10 de 24 usuarios")).toBeDefined();
    });
  });

  it("maneja el filtro con el teclado y lo cierra con Escape o al hacer clic afuera", async () => {
    const user = userEvent.setup();
    await renderLoadedView();
    const combobox = screen.getByRole("combobox", { name: "Tipo de usuario" });

    combobox.focus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("listbox")).toBeDefined();
    await user.keyboard("{ArrowDown}{Enter}");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
    });
    await waitFor(() => {
      expect(combobox.textContent).toContain("Estudiante");
    });

    await user.click(combobox);
    expect(await screen.findByRole("listbox")).toBeDefined();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
    });

    await user.click(combobox);
    expect(await screen.findByRole("listbox")).toBeDefined();
    await user.click(document.body);
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
    });
  });

  it("no vuelve a consultar si se elige la misma opción", async () => {
    const user = userEvent.setup();
    const getRegisteredUsersSpy = vi.spyOn(reportsService, "getRegisteredUsers");
    await renderLoadedView();

    await selectUserType(user, "Todos");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
    });
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

  it("exporta en CSV los usuarios del filtro seleccionado y descarga el archivo", async () => {
    const user = userEvent.setup();
    const file = new Blob(["Usuario"], { type: "text/csv" });
    let resolveExport: (value: { file: Blob; fileName: string }) => void = () => undefined;
    const exportSpy = vi.spyOn(reportsService, "exportRegisteredUsersCsv").mockImplementationOnce(
      () => new Promise((resolve) => (resolveExport = resolve)),
    );
    const downloadSpy = vi.spyOn(downloadFileModule, "downloadFile").mockImplementation(() => undefined);
    await renderLoadedView();
    await selectUserType(user, "Empresa");

    await user.click(screen.getByRole("button", { name: "Exportar CSV" }));

    const exportingButton = screen.getByRole("button", { name: "Exportando..." }) as HTMLButtonElement;
    expect(exportingButton.disabled).toBe(true);
    expect(exportSpy).toHaveBeenCalledWith({ userType: "COMPANY" });

    resolveExport({ file, fileName: "usuarios-registrados-2026-10-03.csv" });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Exportar CSV" })).toBeDefined();
    });
    expect(downloadSpy).toHaveBeenCalledWith(file, "usuarios-registrados-2026-10-03.csv");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("muestra un mensaje si falla la exportación", async () => {
    vi.spyOn(reportsService, "exportRegisteredUsersCsv").mockRejectedValueOnce(new Error("Network error"));
    const downloadSpy = vi.spyOn(downloadFileModule, "downloadFile");
    await renderLoadedView();

    fireEvent.click(screen.getByRole("button", { name: "Exportar CSV" }));

    expect((await screen.findByRole("alert")).textContent).toBe("No se pudo exportar el reporte. Inténtalo de nuevo.");
    expect(downloadSpy).not.toHaveBeenCalled();
  });
});
