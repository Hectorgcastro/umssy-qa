import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { detail } from "../components/data-contrast-panel.test";
import { requestReviewService } from "../services/request-review.service";
import { RequestDetailView } from "./request-detail-view";

const getRequestDetail = vi.spyOn(requestReviewService, "getRequestDetail");
const getDocumentBlob = vi.spyOn(requestReviewService, "getDocumentBlob");
const revoke = vi.fn();

describe("RequestDetailView", () => {
  beforeEach(() => {
    getRequestDetail.mockReset();
    getDocumentBlob.mockReset();
    revoke.mockReset();
    vi.stubGlobal("URL", { createObjectURL: () => "blob:documento", revokeObjectURL: revoke });
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("muestra el esqueleto y luego el encabezado, el visor y el panel de contraste", async () => {
    getRequestDetail.mockResolvedValue({ ok: true, data: detail });
    getDocumentBlob.mockResolvedValue({ ok: true, data: new Blob(["%PDF"]) });
    render(<RequestDetailView id="id-1" />);

    expect(screen.getByTestId("detail-skeleton")).toBeInTheDocument();
    expect(await screen.findByText(/Solicitud SOL-2026-0001/)).toBeInTheDocument();
    expect(screen.getByText(/Estado: En revisión/)).toBeInTheDocument();
    expect(await screen.findByTitle("Documento de respaldo")).toHaveAttribute("src", "blob:documento");
    expect(screen.getByRole("region", { name: "Contraste de datos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Volver a la bandeja/ })).toHaveAttribute("href", "/backoffice/solicitudes");
    expect(getDocumentBlob).toHaveBeenCalledWith("id-1");
  });

  it("muestra el error si la solicitud no se puede cargar", async () => {
    getRequestDetail.mockResolvedValue({ ok: false, status: 404, message: "La solicitud no existe." });
    render(<RequestDetailView id="x" />);

    expect(await screen.findByRole("alert")).toHaveTextContent("La solicitud no existe.");
    expect(getDocumentBlob).not.toHaveBeenCalled();
  });

  it("avisa si la solicitud no tiene documento y no lo pide", async () => {
    getRequestDetail.mockResolvedValue({ ok: true, data: { ...detail, document: null, requestCode: null } });
    render(<RequestDetailView id="id-1" />);

    expect(await screen.findByText("Esta solicitud no tiene un documento adjunto.")).toBeInTheDocument();
    expect(getDocumentBlob).not.toHaveBeenCalled();
  });

  it("muestra el error del documento si no se puede descargar", async () => {
    getRequestDetail.mockResolvedValue({ ok: true, data: detail });
    getDocumentBlob.mockResolvedValue({ ok: false, status: 0, message: "No se pudo conectar con el servidor. Inténtalo de nuevo." });
    render(<RequestDetailView id="id-1" />);

    expect(await screen.findByText("No se pudo conectar con el servidor. Inténtalo de nuevo.")).toBeInTheDocument();
  });

  it("libera la URL del documento al salir", async () => {
    getRequestDetail.mockResolvedValue({ ok: true, data: detail });
    getDocumentBlob.mockResolvedValue({ ok: true, data: new Blob(["%PDF"]) });
    const view = render(<RequestDetailView id="id-1" />);
    await screen.findByTitle("Documento de respaldo");

    view.unmount();

    expect(revoke).toHaveBeenCalledWith("blob:documento");
  });

  it("al aprobar, el estado en pantalla pasa de En revisión a Aprobada", async () => {
    getRequestDetail.mockResolvedValue({ ok: true, data: detail });
    getDocumentBlob.mockResolvedValue({ ok: true, data: new Blob(["%PDF"]) });
    vi.spyOn(requestReviewService, "approveRequest").mockResolvedValue({
      ok: true,
      data: { id: "id-1", status: "approved", activationCodeSent: true },
    });
    render(<RequestDetailView id="id-1" />);
    expect(await screen.findByText(/Estado: En revisión/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Aprobar solicitud" }));
    fireEvent.click(await screen.findByRole("button", { name: "Aprobar y enviar código" }));

    expect(await screen.findByText(/Estado: Aprobada/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Aprobar solicitud" })).toBeNull();
  });
});
