import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DocumentsSteps } from "./documents-steps";

describe("DocumentsSteps", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders both steps with their number and label", () => {
    render(<DocumentsSteps activeStep="cv" />);

    expect(screen.getByRole("list", { name: "Pasos de documentos" })).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Currículum vitae")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("Certificaciones")).toBeInTheDocument();
  });

  it("marks only the cv step as current when it is active", () => {
    render(<DocumentsSteps activeStep="cv" />);

    const [cvStep, certificationsStep] = screen.getAllByRole("listitem");

    expect(cvStep).toHaveAttribute("aria-current", "step");
    expect(certificationsStep).not.toHaveAttribute("aria-current");
  });

  it("marks only the certifications step as current when it is active", () => {
    render(<DocumentsSteps activeStep="certifications" />);

    const [cvStep, certificationsStep] = screen.getAllByRole("listitem");

    expect(cvStep).not.toHaveAttribute("aria-current");
    expect(certificationsStep).toHaveAttribute("aria-current", "step");
  });
});
