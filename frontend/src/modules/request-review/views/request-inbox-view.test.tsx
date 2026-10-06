import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requestReviewService } from "../services/request-review.service";
import type { ReviewListItem } from "../types/request-review.types";
import { RequestInboxView } from "./request-inbox-view";

const listRequests = vi.spyOn(requestReviewService, "listRequests");

function row(index: number, status: ReviewListItem["status"] = "pending"): ReviewListItem {
  return {
    id: `id-${index}`,
    requestCode: `SOL-2026-000${index}`,
    fullName: `Persona ${index}`,
    email: `p${index}@umss.test`,
    sisCode: `20180${index}`,
    documentType: "academic_diploma",
    submittedAt: new Date().toISOString(),
    status,
  };
}

const page = (items: ReviewListItem[], total = items.length) => ({ ok: true as const, data: { items, total, page: 1, offset: 0 } });

describe("RequestInboxView", () => {
  beforeEach(() => listRequests.mockReset());
  afterEach(() => cleanup());

  it("carga la pestaña Pendientes, muestra el esqueleto y luego las filas", async () => {
    listRequests.mockResolvedValue(page([row(1), row(2)]));
    render(<RequestInboxView />);

    expect(screen.getAllByTestId("request-skeleton-row").length).toBeGreaterThan(0);
    expect(await screen.findByText("Persona 1")).toBeInTheDocument();
    expect(listRequests).toHaveBeenCalledWith("pending", 1);
    expect(screen.getByText("Mostrando 1 a 2 de 2 solicitudes")).toBeInTheDocument();
  });

  it("cada pestaña pide solo su estado y vuelve a la página 1", async () => {
    listRequests.mockResolvedValue(page([row(1)]));
    render(<RequestInboxView />);
    await screen.findByText("Persona 1");

    for (const [tab, status] of [["En revisión", "in_review"], ["Aprobadas", "approved"], ["Rechazadas", "rejected"]] as const) {
      fireEvent.click(screen.getByRole("tab", { name: tab }));
      await waitFor(() => expect(listRequests).toHaveBeenLastCalledWith(status, 1));
    }
  });

  it("la paginación navega entre páginas", async () => {
    listRequests.mockResolvedValue(page(Array.from({ length: 10 }, (_, i) => row(i + 1)), 25));
    render(<RequestInboxView />);
    await screen.findByText("Persona 1");
    expect(screen.getByText("Mostrando 1 a 10 de 25 solicitudes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    await waitFor(() => expect(listRequests).toHaveBeenLastCalledWith("pending", 2));
    await screen.findByText("Mostrando 11 a 20 de 25 solicitudes");

    fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
    await waitFor(() => expect(listRequests).toHaveBeenLastCalledWith("pending", 1));
  });

  it("al llegar al final deshabilita Siguiente", async () => {
    listRequests.mockResolvedValue(page([row(1)], 1));
    render(<RequestInboxView />);
    await screen.findByText("Persona 1");
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled();
  });

  it("muestra un mensaje claro si no hay solicitudes", async () => {
    listRequests.mockResolvedValue(page([], 0));
    render(<RequestInboxView />);
    expect(await screen.findByText("No hay solicitudes en este estado.")).toBeInTheDocument();
  });

  it("muestra el error del servicio en español", async () => {
    listRequests.mockResolvedValue({ ok: false, status: 403, message: "No tienes permiso para ver las solicitudes." });
    render(<RequestInboxView />);
    expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permiso para ver las solicitudes.");
  });
});
