import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CERTIFICATION_DOCUMENT_MESSAGES } from "../config/certification-document.config";
import { CERTIFICATION_FEEDBACK_MESSAGES } from "../config/certification-feedback.config";
import { certificationsService } from "../services/certifications.service";
import type { Certification } from "../types/certification.types";
import { CertificationsView } from "./certifications-view";

vi.mock("../services/certifications.service", () => ({
  certificationsService: {
    getCertifications: vi.fn(),
    createCertification: vi.fn(),
    updateCertification: vi.fn(),
    deleteCertification: vi.fn(),
    uploadDocument: vi.fn(),
    getDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

function createCertification(id: string, name: string, issueDate: string): Certification {
  return {
    id,
    name,
    issuingOrganization: "Scrum Alliance",
    issueDate,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  };
}

const SCRUM = createCertification("scrum", "Scrum Master", "2022-05-10");
const AWS = createCertification("aws", "AWS Cloud Practitioner", "2025-02-20");

function createDeferred<T>() {
  let resolve: (value: T) => void = () => undefined;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

async function renderView() {
  await act(async () => {
    render(<CertificationsView />);
  });
  return userEvent.setup();
}

function getCertificationNames() {
  return within(screen.getByRole("list", { name: "Certificaciones" }))
    .getAllByRole("heading")
    .map((heading) => heading.textContent);
}

describe("CertificationsView", () => {
  beforeEach(() => {
    vi.mocked(certificationsService.getCertifications).mockResolvedValue([SCRUM, AWS]);
    vi.mocked(certificationsService.deleteCertification).mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("shows a loading message while the certifications load", () => {
    vi.mocked(certificationsService.getCertifications).mockReturnValue(new Promise(() => undefined));
    render(<CertificationsView />);

    expect(screen.getByText("Cargando certificaciones...")).toBeInTheDocument();
  });

  it("renders the certifications from the newest to the oldest", async () => {
    await renderView();

    expect(screen.getByText("Ordenadas de la más reciente a la más antigua.")).toBeInTheDocument();
    expect(getCertificationNames()).toEqual(["AWS Cloud Practitioner", "Scrum Master"]);
    expect(screen.getByRole("button", { name: "Agregar certificación" })).toBeInTheDocument();
    expect(screen.getByText("Certificaciones", { selector: "li span" })).toBeInTheDocument();
  });

  it("shows the empty state when there are no certifications", async () => {
    vi.mocked(certificationsService.getCertifications).mockResolvedValue([]);
    await renderView();

    expect(screen.getByText("Aún no has agregado certificaciones")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Agregar certificación" })).toHaveLength(1);
    expect(screen.queryByRole("list", { name: "Certificaciones" })).not.toBeInTheDocument();
  });

  it("shows the load error instead of the empty state", async () => {
    vi.mocked(certificationsService.getCertifications).mockRejectedValue(new Error("failed"));
    await renderView();

    expect(screen.getByRole("alert")).toHaveTextContent(CERTIFICATION_FEEDBACK_MESSAGES.loadError);
    expect(screen.queryByText("Aún no has agregado certificaciones")).not.toBeInTheDocument();
  });

  it("opens the form from the empty state and closes it on cancel", async () => {
    vi.mocked(certificationsService.getCertifications).mockResolvedValue([]);
    const user = await renderView();

    await user.click(screen.getByRole("button", { name: "Agregar certificación" }));

    expect(screen.getByRole("form", { name: "Agregar certificación" })).toBeInTheDocument();
    expect(screen.queryByText("Aún no has agregado certificaciones")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.getByText("Aún no has agregado certificaciones")).toBeInTheDocument();
  });

  it("adds a certification and reloads the list", async () => {
    const created = createCertification("ccna", "CCNA", "2024-01-15");
    vi.mocked(certificationsService.createCertification).mockResolvedValue(created);
    const user = await renderView();

    await user.click(screen.getByRole("button", { name: "Agregar certificación" }));
    vi.mocked(certificationsService.getCertifications).mockResolvedValue([SCRUM, AWS, created]);
    await user.type(screen.getByLabelText(/Nombre de la certificación/), "CCNA");
    await user.type(screen.getByLabelText(/Organización emisora/), "Cisco");
    fireEvent.change(screen.getByLabelText(/Fecha de emisión/), {
      target: { value: "2024-01-15" },
    });
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(certificationsService.createCertification).toHaveBeenCalledWith({
      name: "CCNA",
      issuingOrganization: "Cisco",
      issueDate: "2024-01-15",
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      CERTIFICATION_FEEDBACK_MESSAGES.createSuccess,
    );
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(getCertificationNames()).toEqual(["AWS Cloud Practitioner", "CCNA", "Scrum Master"]);
  });

  it("edits a certification with its current values", async () => {
    vi.mocked(certificationsService.updateCertification).mockResolvedValue({
      ...SCRUM,
      name: "Professional Scrum Master",
    });
    const user = await renderView();

    await user.click(screen.getByRole("button", { name: "Editar Scrum Master" }));

    expect(screen.getByRole("form", { name: "Editar certificación" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de la certificación/)).toHaveValue("Scrum Master");
    expect(screen.getByLabelText(/Fecha de emisión/)).toHaveValue("2022-05-10");

    await user.clear(screen.getByLabelText(/Nombre de la certificación/));
    await user.type(screen.getByLabelText(/Nombre de la certificación/), "Professional Scrum Master");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(certificationsService.updateCertification).toHaveBeenCalledWith("scrum", {
      name: "Professional Scrum Master",
      issuingOrganization: "Scrum Alliance",
      issueDate: "2022-05-10",
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      CERTIFICATION_FEEDBACK_MESSAGES.updateSuccess,
    );
  });

  it("keeps the form open when saving fails", async () => {
    vi.mocked(certificationsService.updateCertification).mockRejectedValue(new Error("failed"));
    const user = await renderView();

    await user.click(screen.getByRole("button", { name: "Editar Scrum Master" }));
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      CERTIFICATION_FEEDBACK_MESSAGES.updateError,
    );
    expect(screen.getByRole("form", { name: "Editar certificación" })).toBeInTheDocument();
  });

  it("opens the delete dialog with the certification name and cancels without deleting", async () => {
    const user = await renderView();

    await user.click(screen.getByRole("button", { name: "Eliminar Scrum Master" }));

    const dialog = await screen.findByRole("alertdialog");
    expect(within(dialog).getByText("Eliminar certificación")).toBeInTheDocument();
    expect(within(dialog).getByText(/"Scrum Master"/)).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(certificationsService.deleteCertification).not.toHaveBeenCalled();
    expect(getCertificationNames()).toEqual(["AWS Cloud Practitioner", "Scrum Master"]);
  });

  it("deletes the certification after confirming and reloads the list", async () => {
    const deletion = createDeferred<void>();
    vi.mocked(certificationsService.deleteCertification).mockReturnValue(deletion.promise);
    const user = await renderView();

    await user.click(screen.getByRole("button", { name: "Eliminar Scrum Master" }));
    const dialog = await screen.findByRole("alertdialog");
    vi.mocked(certificationsService.getCertifications).mockResolvedValue([AWS]);
    await user.click(within(dialog).getByRole("button", { name: "Eliminar" }));

    expect(within(dialog).getByRole("button", { name: "Eliminando..." })).toBeDisabled();

    await act(async () => {
      deletion.resolve();
      await deletion.promise;
    });

    expect(certificationsService.deleteCertification).toHaveBeenCalledWith("scrum");
    expect(await screen.findByRole("status")).toHaveTextContent(
      CERTIFICATION_FEEDBACK_MESSAGES.deleteSuccess,
    );
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(getCertificationNames()).toEqual(["AWS Cloud Practitioner"]);
  });

  it("shows an error when the certification cannot be deleted", async () => {
    vi.mocked(certificationsService.deleteCertification).mockRejectedValue(new Error("failed"));
    const user = await renderView();

    await user.click(screen.getByRole("button", { name: "Eliminar Scrum Master" }));
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Eliminar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      CERTIFICATION_FEEDBACK_MESSAGES.deleteError,
    );
    expect(getCertificationNames()).toEqual(["AWS Cloud Practitioner", "Scrum Master"]);
  });

  describe("certification documents", () => {
    const CERTIFICATE_PDF = new File(["certificate"], "certificate.pdf", {
      type: "application/pdf",
    });

    it("uploads the document after adding the certification", async () => {
      const created = createCertification("ccna", "CCNA", "2024-01-15");
      vi.mocked(certificationsService.createCertification).mockResolvedValue(created);
      vi.mocked(certificationsService.uploadDocument).mockResolvedValue(undefined);
      const user = await renderView();

      await user.click(screen.getByRole("button", { name: "Agregar certificación" }));
      await user.type(screen.getByLabelText(/Nombre de la certificación/), "CCNA");
      await user.type(screen.getByLabelText(/Organización emisora/), "Cisco");
      fireEvent.change(screen.getByLabelText(/Fecha de emisión/), {
        target: { value: "2024-01-15" },
      });
      await user.upload(screen.getByLabelText("Archivo del certificado"), CERTIFICATE_PDF);
      await user.click(screen.getByRole("button", { name: "Guardar" }));

      expect(certificationsService.uploadDocument).toHaveBeenCalledWith("ccna", CERTIFICATE_PDF);
      expect(await screen.findByRole("status")).toHaveTextContent(
        CERTIFICATION_DOCUMENT_MESSAGES.uploadSuccess,
      );
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
    });

    it("removes the current document when editing", async () => {
      const withDocument = { ...SCRUM, hasDocument: true };
      vi.mocked(certificationsService.getCertifications).mockResolvedValue([withDocument, AWS]);
      vi.mocked(certificationsService.updateCertification).mockResolvedValue(withDocument);
      vi.mocked(certificationsService.deleteDocument).mockResolvedValue(undefined);
      const user = await renderView();

      await user.click(screen.getByRole("button", { name: "Editar Scrum Master" }));

      expect(screen.getByText("Documento actual adjunto")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Quitar" }));
      await user.click(screen.getByRole("button", { name: "Guardar" }));

      expect(certificationsService.deleteDocument).toHaveBeenCalledWith("scrum");
      expect(await screen.findByRole("status")).toHaveTextContent(
        CERTIFICATION_DOCUMENT_MESSAGES.removeSuccess,
      );
    });

    it("closes the form and reports when the document cannot be uploaded", async () => {
      vi.mocked(certificationsService.updateCertification).mockResolvedValue(SCRUM);
      vi.mocked(certificationsService.uploadDocument).mockRejectedValue(new Error("failed"));
      const user = await renderView();

      await user.click(screen.getByRole("button", { name: "Editar Scrum Master" }));
      await user.upload(screen.getByLabelText("Archivo del certificado"), CERTIFICATE_PDF);
      await user.click(screen.getByRole("button", { name: "Guardar" }));

      expect(await screen.findByRole("alert")).toHaveTextContent(
        CERTIFICATION_DOCUMENT_MESSAGES.uploadError,
      );
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
    });

    it("does not touch the document when the certification cannot be saved", async () => {
      vi.mocked(certificationsService.updateCertification).mockRejectedValue(new Error("failed"));
      const user = await renderView();

      await user.click(screen.getByRole("button", { name: "Editar Scrum Master" }));
      await user.upload(screen.getByLabelText("Archivo del certificado"), CERTIFICATE_PDF);
      await user.click(screen.getByRole("button", { name: "Guardar" }));

      expect(await screen.findByRole("alert")).toHaveTextContent(
        CERTIFICATION_FEEDBACK_MESSAGES.updateError,
      );
      expect(certificationsService.uploadDocument).not.toHaveBeenCalled();
    });
  });
});
