import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requestReviewService } from "../services/request-review.service";
import { detail } from "./data-contrast-panel.test";
import { VerdictPanel } from "./verdict-panel";

const approveRequest = vi.spyOn(requestReviewService, "approveRequest");

function setup(status: "pending" | "in_review" | "approved" | "rejected" = "in_review") {
  const onStatusChange = vi.fn();
  render(<VerdictPanel detail={detail} status={status} onStatusChange={onStatusChange} />);
  return { onStatusChange };
}

describe("VerdictPanel", () => {
  beforeEach(() => approveRequest.mockReset());
  afterEach(() => cleanup());

  it("en revisión muestra el botón Aprobar solicitud y pide confirmación antes de aprobar", async () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: "Aprobar solicitud" }));

    expect(await screen.findByText("¿Aprobar la solicitud?")).toBeInTheDocument();
    expect(screen.getByText(/Se enviará el código de activación al correo del titulado \(jose@umss.test\)/)).toBeInTheDocument();
    expect(approveRequest).not.toHaveBeenCalled();
  });

  it("cancelar el diálogo no aprueba nada", async () => {
    const { onStatusChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Aprobar solicitud" }));

    fireEvent.click(await screen.findByRole("button", { name: "Cancelar" }));

    await waitFor(() => expect(screen.queryByText("¿Aprobar la solicitud?")).toBeNull());
    expect(approveRequest).not.toHaveBeenCalled();
    expect(onStatusChange).not.toHaveBeenCalled();
  });

  it("al confirmar aprueba, cambia el estado y avisa que se envió el código", async () => {
    approveRequest.mockResolvedValue({ ok: true, data: { id: "id-1", status: "approved", activationCodeSent: true } });
    const { onStatusChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Aprobar solicitud" }));

    fireEvent.click(await screen.findByRole("button", { name: "Aprobar y enviar código" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Solicitud aprobada. Se envió el código de activación al correo del titulado.");
    expect(approveRequest).toHaveBeenCalledWith("id-1");
    expect(onStatusChange).toHaveBeenCalledWith("approved");
  });

  it("si el código no se pudo enviar lo dice, pero la solicitud queda aprobada", async () => {
    approveRequest.mockResolvedValue({ ok: true, data: { id: "id-1", status: "approved", activationCodeSent: false } });
    const { onStatusChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Aprobar solicitud" }));
    fireEvent.click(await screen.findByRole("button", { name: "Aprobar y enviar código" }));

    expect(await screen.findByRole("status")).toHaveTextContent("no se pudo enviar el código de activación");
    expect(onStatusChange).toHaveBeenCalledWith("approved");
  });

  it("un error del servidor se muestra en español y no cambia el estado", async () => {
    approveRequest.mockResolvedValue({ ok: false, status: 409, message: "La solicitud no está en revisión" });
    const { onStatusChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Aprobar solicitud" }));
    fireEvent.click(await screen.findByRole("button", { name: "Aprobar y enviar código" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("La solicitud no está en revisión");
    expect(onStatusChange).not.toHaveBeenCalled();
  });

  it.each(["pending", "approved", "rejected"] as const)("con la solicitud %s no hay botón de aprobar", (status) => {
    setup(status);
    expect(screen.queryByRole("button", { name: "Aprobar solicitud" })).toBeNull();
    expect(screen.getByText("Esta solicitud ya no admite un dictamen.")).toBeInTheDocument();
  });
});
