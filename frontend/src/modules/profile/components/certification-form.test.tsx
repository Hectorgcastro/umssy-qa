import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CERTIFICATION_VALIDATION_MESSAGES } from "../config/certification-validation.config";
import { FILE_VALIDATION_MESSAGES } from "../config/file-validation-messages.config";
import type { CertificationFormProps } from "../types/certification-form-props.types";
import type { CreateCertificationDto } from "../types/create-certification-dto.types";
import { CertificationForm } from "./certification-form";

const SAVED_VALUES: CreateCertificationDto = {
  name: "AWS Certified Cloud Practitioner",
  issuingOrganization: "Amazon Web Services",
  issueDate: "2025-03-10",
};

const CERTIFICATE_PDF = new File(["certificate"], "certificate.pdf", { type: "application/pdf" });

function renderForm({
  initialData,
  hasDocument = false,
  isPending = false,
  onSubmit = vi.fn(),
}: {
  initialData?: CreateCertificationDto;
  hasDocument?: boolean;
  isPending?: boolean;
  onSubmit?: CertificationFormProps["onSubmit"];
} = {}) {
  const onCancel = vi.fn();
  render(
    <CertificationForm
      initialData={initialData}
      hasDocument={hasDocument}
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />,
  );
  return { onSubmit, onCancel, user: userEvent.setup() };
}

function getNameInput() {
  return screen.getByLabelText(/Nombre de la certificación/);
}

function getOrganizationInput() {
  return screen.getByLabelText(/Organización emisora/);
}

function getFileInput(): HTMLInputElement {
  return screen.getByLabelText("Archivo del certificado");
}

function getIssueDateInput() {
  return screen.getByLabelText(/Fecha de emisión/);
}

describe("CertificationForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders empty inputs to add a certification", () => {
    renderForm();

    expect(screen.getByRole("form", { name: "Agregar certificación" })).toBeInTheDocument();
    expect(getNameInput()).toHaveValue("");
    expect(getOrganizationInput()).toHaveValue("");
    expect(getIssueDateInput()).toHaveValue("");
    expect(getIssueDateInput()).toHaveAttribute("type", "date");
    expect(getIssueDateInput()).toHaveAttribute("max");
    expect(screen.getByRole("button", { name: "Guardar" })).toBeEnabled();
  });

  it("fills the inputs with the initial data to edit a certification", () => {
    renderForm({ initialData: SAVED_VALUES });

    expect(screen.getByRole("form", { name: "Editar certificación" })).toBeInTheDocument();
    expect(getNameInput()).toHaveValue(SAVED_VALUES.name);
    expect(getOrganizationInput()).toHaveValue(SAVED_VALUES.issuingOrganization);
    expect(getIssueDateInput()).toHaveValue(SAVED_VALUES.issueDate);
  });

  it("shows inline errors and does not submit invalid values", async () => {
    const { onSubmit, user } = renderForm();

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getAllByText(CERTIFICATION_VALIDATION_MESSAGES.required)).toHaveLength(3);
    expect(getNameInput()).toHaveAttribute("aria-invalid", "true");
    expect(getNameInput()).toHaveAttribute("aria-describedby", "certification-name-error");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows an inline error for a future issue date", async () => {
    const { onSubmit, user } = renderForm({
      initialData: { ...SAVED_VALUES, issueDate: "2999-01-01" },
    });

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText(CERTIFICATION_VALIDATION_MESSAGES.futureDate)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("clears the error of a field when it changes", async () => {
    const { user } = renderForm();

    await user.click(screen.getByRole("button", { name: "Guardar" }));
    await user.type(getNameInput(), "Scrum Master");

    expect(getNameInput()).toHaveAttribute("aria-invalid", "false");
    expect(screen.getAllByText(CERTIFICATION_VALIDATION_MESSAGES.required)).toHaveLength(2);
  });

  it("submits the trimmed values", async () => {
    const { onSubmit, user } = renderForm();

    await user.type(getNameInput(), "  Scrum Master  ");
    await user.type(getOrganizationInput(), " Scrum Alliance ");
    fireEvent.change(getIssueDateInput(), { target: { value: "2025-04-20" } });
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        name: "Scrum Master",
        issuingOrganization: "Scrum Alliance",
        issueDate: "2025-04-20",
      },
      { type: "keep" },
    );
  });

  it("disables the inputs and buttons while the submit is in progress", async () => {
    let resolveSubmit: () => void = () => undefined;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );
    const { user } = renderForm({ initialData: SAVED_VALUES, onSubmit });

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
    expect(getNameInput()).toBeDisabled();

    resolveSubmit();

    expect(await screen.findByRole("button", { name: "Guardar" })).toBeEnabled();
  });

  it("disables the submit button while the mutation is pending", () => {
    renderForm({ initialData: SAVED_VALUES, isPending: true });

    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
  });

  it("discards the changes and notifies when cancelled", async () => {
    const { onCancel, onSubmit, user } = renderForm({ initialData: SAVED_VALUES });

    await user.clear(getNameInput());
    await user.type(getNameInput(), "Changed name");
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(getNameInput()).toHaveValue(SAVED_VALUES.name);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  describe("document field", () => {
    it("shows the accepted formats when there is no document", () => {
      renderForm();

      expect(screen.getByText("PDF, PNG o JPG de hasta 5 MB.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Seleccionar archivo" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Quitar" })).not.toBeInTheDocument();
      expect(getFileInput()).toHaveAttribute("accept", ".pdf,.png,.jpg,.jpeg");
    });

    it("opens the file picker from the select button", async () => {
      const { user } = renderForm();
      const clickSpy = vi.spyOn(getFileInput(), "click");

      await user.click(screen.getByRole("button", { name: "Seleccionar archivo" }));

      expect(clickSpy).toHaveBeenCalled();
    });

    it("submits a new document with the certification", async () => {
      const { onSubmit, user } = renderForm({ initialData: SAVED_VALUES });

      await user.upload(getFileInput(), CERTIFICATE_PDF);

      expect(screen.getByText(/certificate\.pdf/)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Reemplazar archivo" })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Guardar" }));

      expect(onSubmit).toHaveBeenCalledWith(SAVED_VALUES, {
        type: "replace",
        file: CERTIFICATE_PDF,
      });
    });

    it("shows an inline error for a file with an invalid type", () => {
      renderForm();

      fireEvent.change(getFileInput(), {
        target: { files: [new File(["text"], "notes.txt", { type: "text/plain" })] },
      });

      expect(screen.getByText(FILE_VALIDATION_MESSAGES.invalidCertificateType)).toBeInTheDocument();
      expect(getFileInput()).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByText("PDF, PNG o JPG de hasta 5 MB.")).toBeInTheDocument();
    });

    it("shows an inline error for a file that is too large", () => {
      renderForm();
      const largeFile = new File(["x"], "large.pdf", { type: "application/pdf" });
      Object.defineProperty(largeFile, "size", { value: 6 * 1024 * 1024 });

      fireEvent.change(getFileInput(), { target: { files: [largeFile] } });

      expect(screen.getByText(FILE_VALIDATION_MESSAGES.fileTooLarge)).toBeInTheDocument();
    });

    it("ignores an empty file selection", () => {
      renderForm();

      fireEvent.change(getFileInput(), { target: { files: [] } });

      expect(screen.getByText("PDF, PNG o JPG de hasta 5 MB.")).toBeInTheDocument();
    });

    it("discards a selected file before saving", async () => {
      const { onSubmit, user } = renderForm({ initialData: SAVED_VALUES });

      await user.upload(getFileInput(), CERTIFICATE_PDF);
      await user.click(screen.getByRole("button", { name: "Quitar" }));
      await user.click(screen.getByRole("button", { name: "Guardar" }));

      expect(screen.queryByText(/certificate\.pdf/)).not.toBeInTheDocument();
      expect(onSubmit).toHaveBeenCalledWith(SAVED_VALUES, { type: "keep" });
    });

    it("shows the current document when editing", () => {
      renderForm({ initialData: SAVED_VALUES, hasDocument: true });

      expect(screen.getByText("Documento actual adjunto")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Reemplazar archivo" })).toBeInTheDocument();
    });

    it("removes the current document when editing", async () => {
      const { onSubmit, user } = renderForm({ initialData: SAVED_VALUES, hasDocument: true });

      await user.click(screen.getByRole("button", { name: "Quitar" }));

      expect(screen.getByText("PDF, PNG o JPG de hasta 5 MB.")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Guardar" }));

      expect(onSubmit).toHaveBeenCalledWith(SAVED_VALUES, { type: "remove" });
    });

    it("keeps the current document when a new selection is discarded", async () => {
      const { onSubmit, user } = renderForm({ initialData: SAVED_VALUES, hasDocument: true });

      await user.upload(getFileInput(), CERTIFICATE_PDF);
      await user.click(screen.getByRole("button", { name: "Quitar" }));

      expect(screen.getByText("Documento actual adjunto")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Guardar" }));

      expect(onSubmit).toHaveBeenCalledWith(SAVED_VALUES, { type: "keep" });
    });

    it("restores the document state when cancelled", async () => {
      const { user } = renderForm({ initialData: SAVED_VALUES, hasDocument: true });

      await user.click(screen.getByRole("button", { name: "Quitar" }));
      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(screen.getByText("Documento actual adjunto")).toBeInTheDocument();
    });
  });
});
