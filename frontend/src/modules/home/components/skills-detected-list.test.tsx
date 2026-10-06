import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SkillsDetectedList } from "./skills-detected-list";

describe("Detected skills (#221)", () => {
  afterEach(cleanup);
  it("renders canonical chips once and actual analysis timing", () => {
    render(
      <SkillsDetectedList
        skills={["Python", "Python", "Scrum"]}
        processingTime={0.02}
      />,
    );
    expect(screen.getAllByText("Python")).toHaveLength(1);
    expect(
      screen.getByText("Análisis completado en 0.02 s"),
    ).toBeInTheDocument();
  });
  it("does not invent chips for an empty analysis", () => {
    const { container } = render(
      <SkillsDetectedList skills={[]} processingTime={0} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
