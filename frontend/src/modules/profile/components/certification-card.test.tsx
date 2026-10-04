import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Certification } from "../types/certification.types";
import { CertificationCard } from "./certification-card";

const CERTIFICATION: Certification = {
  id: "certification-1",
  name: "AWS Certified Cloud Practitioner",
  issuingOrganization: "Amazon Web Services",
  issueDate: "2025-03-07",
  createdAt: "2025-03-08T10:00:00.000Z",
  updatedAt: "2025-03-08T10:00:00.000Z",
};

function renderCard(isBusy = false, certification = CERTIFICATION) {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const onViewDocument = vi.fn();
  render(
    <CertificationCard
      certification={certification}
      isBusy={isBusy}
      onEdit={onEdit}
      onDelete={onDelete}
      onViewDocument={onViewDocument}
    />,
  );
  return { onEdit, onDelete, onViewDocument, user: userEvent.setup() };
}

describe("CertificationCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders markup in the name as plain text", () => {
    const { container } = render(
      <CertificationCard
        certification={{
          ...CERTIFICATION,
          name: "<script>alert(1)</script>",
          issuingOrganization: "O'Reilly \"Media\"",
        }}
        isBusy={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("<script>alert(1)</script>")).toBeInTheDocument();
    expect(screen.getByText(/O'Reilly "Media"/)).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
  });

  it("renders the name, the issuing organization and the formatted issue date", () => {
    renderCard();

    expect(
      screen.getByRole("heading", { name: "AWS Certified Cloud Practitioner" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
    expect(screen.getByText("7 mar 2025")).toHaveAttribute("dateTime", "2025-03-07");
  });

  it("notifies when the certification is edited", async () => {
    const { onEdit, onDelete, user } = renderCard();

    await user.click(screen.getByRole("button", { name: "Editar AWS Certified Cloud Practitioner" }));

    expect(onEdit).toHaveBeenCalledWith(CERTIFICATION);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("notifies when the certification is deleted", async () => {
    const { onEdit, onDelete, user } = renderCard();

    await user.click(
      screen.getByRole("button", { name: "Eliminar AWS Certified Cloud Practitioner" }),
    );

    expect(onDelete).toHaveBeenCalledWith(CERTIFICATION);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("disables the actions while busy", () => {
    renderCard(true);

    expect(
      screen.getByRole("button", { name: "Editar AWS Certified Cloud Practitioner" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Eliminar AWS Certified Cloud Practitioner" }),
    ).toBeDisabled();
  });

  it("does not show document actions when there is no document", () => {
    renderCard();

    expect(screen.queryByText("Documento adjunto")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Ver documento/ })).not.toBeInTheDocument();
  });

  it("shows the attached document and opens it", async () => {
    const withDocument = { ...CERTIFICATION, hasDocument: true };
    const { onViewDocument, user } = renderCard(false, withDocument);

    expect(screen.getByText("Documento adjunto")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Ver documento de AWS Certified Cloud Practitioner",
      }),
    );

    expect(onViewDocument).toHaveBeenCalledWith(withDocument);
  });

  it("hides the view action when no handler is provided", () => {
    render(
      <CertificationCard
        certification={{ ...CERTIFICATION, hasDocument: true }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Documento adjunto")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Ver documento/ })).not.toBeInTheDocument();
  });
});
