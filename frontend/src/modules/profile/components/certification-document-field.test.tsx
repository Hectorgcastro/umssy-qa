import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CertificationDocumentFieldProps } from "../types/certification-document-field-props.types";
import { CertificationDocumentField } from "./certification-document-field";

const CERTIFICATE_PDF = new File(["certificate"], "certificate.pdf", { type: "application/pdf" });

function renderField(props: Partial<CertificationDocumentFieldProps> = {}) {
  const onSelectFile = vi.fn();
  const onRemove = vi.fn();
  render(
    <CertificationDocumentField
      selectedFile={null}
      hasCurrentDocument={false}
      onSelectFile={onSelectFile}
      onRemove={onRemove}
      {...props}
    />,
  );
  return { onSelectFile, onRemove, user: userEvent.setup() };
}

afterEach(cleanup);

describe("CertificationDocumentField", () => {
  it("shows the hint and only the select button when there is no document", () => {
    renderField();

    expect(screen.getByText("PDF, PNG o JPG de hasta 5 MB.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Seleccionar archivo" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Quitar" })).not.toBeInTheDocument();
  });

  it("reports the file picked in the input", () => {
    const { onSelectFile } = renderField();

    fireEvent.change(screen.getByLabelText("Archivo del certificado"), {
      target: { files: [CERTIFICATE_PDF] },
    });

    expect(onSelectFile).toHaveBeenCalledWith(CERTIFICATE_PDF);
  });

  it("ignores a change event without files", () => {
    const { onSelectFile } = renderField();

    fireEvent.change(screen.getByLabelText("Archivo del certificado"), {
      target: { files: [] },
    });

    expect(onSelectFile).not.toHaveBeenCalled();
  });

  it("shows the selected file name and size with replace and remove actions", async () => {
    const { onRemove, user } = renderField({ selectedFile: CERTIFICATE_PDF });

    expect(screen.getByText(/certificate\.pdf/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reemplazar archivo" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Quitar" }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("shows the current document message when one is attached", () => {
    renderField({ hasCurrentDocument: true });

    expect(screen.getByText("Documento actual adjunto")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reemplazar archivo" })).toBeInTheDocument();
  });

  it("opens the file picker from the select button", async () => {
    const { user } = renderField();
    const input = screen.getByLabelText("Archivo del certificado") as HTMLInputElement;
    const click = vi.spyOn(input, "click");

    await user.click(screen.getByRole("button", { name: "Seleccionar archivo" }));

    expect(click).toHaveBeenCalled();
  });

  it("renders the validation error", () => {
    renderField({ error: "El archivo debe ser PDF, PNG o JPG." });

    expect(screen.getByText("El archivo debe ser PDF, PNG o JPG.")).toBeInTheDocument();
  });

  it("disables the actions while busy", () => {
    renderField({ selectedFile: CERTIFICATE_PDF, disabled: true });

    expect(screen.getByRole("button", { name: "Quitar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reemplazar archivo" })).toBeDisabled();
  });
});
