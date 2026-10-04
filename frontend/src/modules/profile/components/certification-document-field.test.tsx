import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CertificationDocumentField } from "./certification-document-field";

const CERTIFICATE_PDF = new File(["certificate"], "certificate.pdf", { type: "application/pdf" });

function renderField(props: Partial<Parameters<typeof CertificationDocumentField>[0]> = {}) {
  const onSelectFile = vi.fn();
  render(
    <CertificationDocumentField selectedFile={null} onSelectFile={onSelectFile} {...props} />,
  );
  return { onSelectFile, user: userEvent.setup() };
}

function getFileInput(): HTMLInputElement {
  return screen.getByLabelText(/Archivo de respaldo/);
}

describe("CertificationDocumentField", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows the accepted formats and the select button without a file", () => {
    renderField();

    expect(screen.getByText("PDF, JPG o PNG - Selecciona el documento o imagen.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Seleccionar archivo" })).toBeInTheDocument();
    expect(getFileInput()).toHaveAttribute("accept", ".pdf,.png,.jpg,.jpeg");
  });

  it("opens the file picker from the select button", async () => {
    const { user } = renderField();
    const clickSpy = vi.spyOn(getFileInput(), "click");

    await user.click(screen.getByRole("button", { name: "Seleccionar archivo" }));

    expect(clickSpy).toHaveBeenCalled();
  });

  it("notifies the selected file", async () => {
    const { onSelectFile, user } = renderField();

    await user.upload(getFileInput(), CERTIFICATE_PDF);

    expect(onSelectFile).toHaveBeenCalledWith(CERTIFICATE_PDF);
  });

  it("ignores an empty file selection", () => {
    const { onSelectFile } = renderField();

    fireEvent.change(getFileInput(), { target: { files: [] } });

    expect(onSelectFile).not.toHaveBeenCalled();
  });

  it("shows the selected file name and size and offers to replace it", () => {
    renderField({ selectedFile: CERTIFICATE_PDF });

    expect(screen.getByText("certificate.pdf · 0 KB")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reemplazar archivo" })).toBeInTheDocument();
  });

  it("shows the error and marks the input as invalid", () => {
    renderField({ error: "El archivo debe ser PDF, PNG o JPG." });

    expect(screen.getByText("El archivo debe ser PDF, PNG o JPG.")).toBeInTheDocument();
    expect(getFileInput()).toHaveAttribute("aria-invalid", "true");
  });

  it("disables the controls", () => {
    renderField({ disabled: true });

    expect(screen.getByRole("button", { name: "Seleccionar archivo" })).toBeDisabled();
    expect(getFileInput()).toBeDisabled();
  });
});
