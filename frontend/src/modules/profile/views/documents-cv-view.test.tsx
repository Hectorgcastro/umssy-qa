import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DocumentsCvView } from "./documents-cv-view";

describe("DocumentsCvView", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the cv title in the header and the main heading", () => {
    render(<DocumentsCvView />);

    expect(screen.getByRole("heading", { level: 1, name: "Currículum PDF" })).toBeInTheDocument();
    expect(screen.getAllByText("Currículum PDF")).toHaveLength(2);
    expect(
      screen.getByText("Sube tu CV para tenerlo disponible en el perfil y mantenerlo actualizado"),
    ).toBeInTheDocument();
  });

  it("shows the profile tabs with Documentos active", () => {
    render(<DocumentsCvView />);

    const documentsTab = screen.getByRole("link", { name: "Documentos" });

    expect(screen.getByRole("link", { name: "Datos personales" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Presentación" })).toBeInTheDocument();
    expect(screen.getByText("Trayectoria")).toBeInTheDocument();
    expect(documentsTab).toHaveAttribute("href", "/profile/documents");
    expect(documentsTab).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByText("Documentos")).toHaveLength(1);
  });

  it("renders the upload and saved file cards", () => {
    render(<DocumentsCvView />);

    expect(screen.getByText("Subir currículum")).toBeInTheDocument();
    expect(screen.getByText("Selecciona tu CV en formato PDF")).toBeInTheDocument();
    expect(screen.getByText("Archivo guardado")).toBeInTheDocument();
    expect(
      screen.getByText("Al confirmar la carga, el archivo se mostrará aquí."),
    ).toBeInTheDocument();
  });

  it("keeps the upload actions disabled until the upload is implemented", () => {
    render(<DocumentsCvView />);

    const selectButton = screen.getByRole("button", { name: "Seleccionar PDF" });
    const confirmButton = screen.getByRole("button", { name: "Confirmar carga" });

    expect(selectButton).toBeDisabled();
    expect(selectButton).toHaveAttribute("title", "Disponible próximamente");
    expect(confirmButton).toBeDisabled();
    expect(confirmButton).toHaveAttribute("title", "Disponible próximamente");
  });

  it("does not show the steps indicator nor the certifications link", () => {
    render(<DocumentsCvView />);

    expect(screen.queryByRole("list", { name: "Pasos de documentos" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Ver certificaciones" })).not.toBeInTheDocument();
  });
});
