import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DocumentsCvView } from "./documents-cv-view";

describe("DocumentsCvView", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the documents title and subtitle", () => {
    render(<DocumentsCvView />);

    expect(screen.getByRole("heading", { level: 1, name: "Documentos" })).toBeInTheDocument();
    expect(
      screen.getByText("Sube o actualiza tu CV y mantén tus documentos en orden"),
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

  it("marks step 1 as the current step", () => {
    render(<DocumentsCvView />);

    const steps = within(screen.getByRole("list", { name: "Pasos de documentos" }));

    expect(steps.getByText("Currículum vitae").closest("li")).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(steps.getByText("Certificaciones").closest("li")).not.toHaveAttribute("aria-current");
  });

  it("links Ver certificaciones to the certifications step", () => {
    render(<DocumentsCvView />);

    expect(screen.getByRole("link", { name: "Ver certificaciones" })).toHaveAttribute(
      "href",
      "/profile/documents/certifications",
    );
  });
});
