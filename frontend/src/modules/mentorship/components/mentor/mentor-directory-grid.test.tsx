import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { MentorDirectoryItem } from "../../types/mentor-directory.types";
import { MentorDirectoryGrid } from "./mentor-directory-grid";

const mentors: MentorDirectoryItem[] = [
  {
    id: "1",
    fullName: "Mentor Uno",
    jobTitle: "Backend Developer",
    technicalAreas: ["Backend"],
    isAvailable: true,
  },
  {
    id: "2",
    fullName: "Mentor Dos",
    jobTitle: "QA Engineer",
    technicalAreas: ["QA"],
    isAvailable: false,
  },
];

afterEach(cleanup);

describe("MentorDirectoryGrid", () => {
  it("renderiza varios mentores", () => {
    render(<MentorDirectoryGrid mentors={mentors} />);

    expect(screen.getByText("Mentor Uno")).toBeDefined();
    expect(screen.getByText("Mentor Dos")).toBeDefined();
  });

  it("renderiza un solo mentor", () => {
    render(<MentorDirectoryGrid mentors={[mentors[0]]} />);

    expect(screen.getByText("Mentor Uno")).toBeDefined();
    expect(screen.queryByText("Mentor Dos")).toBeNull();
  });

  it("tolera un arreglo vacío sin renderizar enlaces", () => {
    render(<MentorDirectoryGrid mentors={[]} />);

    expect(screen.queryByRole("link")).toBeNull();
  });
});
