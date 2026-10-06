import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RequirementsPanel } from "./requirements-panel";
import type { GapAnalysis } from "../types/gap-analysis.types";

describe("Dynamic gap UI (#285)", () => {
  afterEach(cleanup);
  const gap: GapAnalysis = {
    skills: [{ name: "Python", status: "Pendiente" }],
    academicRequirements: [{ name: "Sistemas", status: "Pendiente" }],
    otherRequirements: [{ name: "Carta", status: "Pendiente" }],
    experienceRequirements: [],
    missingSkills: ["Python"],
    complete: false,
    message: null,
  };
  it("changes pending skills to fulfilled after a profile update", () => {
    const { rerender } = render(<RequirementsPanel gap={gap} />);
    expect(screen.getAllByText("Pendiente")).toHaveLength(3);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    rerender(
      <RequirementsPanel
        gap={{
          ...gap,
          skills: [{ name: "Python", status: "Cumple" }],
          missingSkills: [],
        }}
      />,
    );
    expect(screen.getByText("Cumple")).toBeInTheDocument();
    expect(screen.getAllByText("Pendiente")).toHaveLength(2);
  });
  it("renders the explicit message when no requirement is missing", () => {
    render(
      <RequirementsPanel
        gap={{
          ...gap,
          skills: [{ name: "Python", status: "Cumple" }],
          academicRequirements: [],
          otherRequirements: [],
          missingSkills: [],
          complete: true,
        }}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Para esta oportunidad no tienes habilidades ni requisitos pendientes",
    );
    expect(screen.queryByText("Pendiente")).not.toBeInTheDocument();
  });
  it("handles a vacancy without any requirements", () => {
    render(
      <RequirementsPanel
        gap={{
          ...gap,
          skills: [],
          academicRequirements: [],
          otherRequirements: [],
          missingSkills: [],
          complete: true,
        }}
      />,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
