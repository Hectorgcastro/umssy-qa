import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WorkExperienceForm } from "./work-experience-form";

describe("Experience NLP chips while editing (#221)", () => {
  afterEach(cleanup);
  it("shows persisted tags and timing in the experience editor", () => {
    render(
      <WorkExperienceForm
        initialValues={{
          companyName: "UMSS",
          position: "Developer",
          startDate: "2024-01-01",
          endDate: "",
          isCurrent: true,
          description: "Python y Scrum",
        }}
        detectedSkills={["Python", "Scrum"]}
        processingTimeMs={23}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("form", { name: "Editar experiencia" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("Scrum")).toBeInTheDocument();
    expect(
      screen.getByText("Análisis completado en 0.023 s"),
    ).toBeInTheDocument();
  });
});
