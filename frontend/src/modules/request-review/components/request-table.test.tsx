import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { ReviewListItem } from "../types/request-review.types";
import { RequestTable } from "./request-table";

const item: ReviewListItem = {
  id: "id-1",
  requestCode: "SOL-2026-0001",
  fullName: "Ana Pérez",
  email: "ana@umss.test",
  sisCode: "2018001",
  documentType: "academic_diploma",
  submittedAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
  status: "in_review",
};

describe("RequestTable", () => {
  afterEach(() => cleanup());

  it("muestra las columnas del mockup y el botón Revisar con su enlace", () => {
    render(<RequestTable items={[item]} />);

    for (const header of ["Solicitante", "Código SIS", "Documento", "Enviada", "Estado", "Acción"]) {
      expect(screen.getByRole("columnheader", { name: header })).toBeInTheDocument();
    }
    expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
    expect(screen.getByText("ana@umss.test")).toBeInTheDocument();
    expect(screen.getByText("2018001")).toBeInTheDocument();
    expect(screen.getByText("Diploma académico")).toBeInTheDocument();
    expect(screen.getByText("hace 2 h")).toBeInTheDocument();
    expect(screen.getByText("En revisión")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Revisar" })).toHaveAttribute("href", "/backoffice/solicitudes/id-1");
  });

  it("muestra el estado como texto y tolera un documento ausente o desconocido", () => {
    render(
      <RequestTable
        items={[
          { ...item, id: "2", documentType: null, status: "rejected" },
          { ...item, id: "3", documentType: "otro_tipo", status: "approved" },
        ]}
      />,
    );

    expect(screen.getByText("Sin documento")).toBeInTheDocument();
    expect(screen.getByText("otro_tipo")).toBeInTheDocument();
    expect(screen.getByText("Rechazada")).toBeInTheDocument();
    expect(screen.getByText("Aprobada")).toBeInTheDocument();
  });

  it("muestra filas de esqueleto mientras carga", () => {
    render(<RequestTable isLoading />);
    expect(screen.getAllByTestId("request-skeleton-row")).toHaveLength(5);
  });

  it("sin datos renderiza solo los encabezados", () => {
    render(<RequestTable />);
    expect(screen.queryByRole("link", { name: "Revisar" })).toBeNull();
  });
});
