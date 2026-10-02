import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PersonalInfoPage from "./personal-info/page";
import PresentationPage from "./presentation/page";
import EducationPage from "./trajectory/education/page";

vi.mock("@/modules/profile", () => ({
  PersonalInfoView: () => <p>personal-info-view</p>,
  PresentationView: () => <p>presentation-view</p>,
  EducationView: () => <p>education-view</p>,
}));

describe("profile pages", () => {
  afterEach(() => {
    cleanup();
  });

  it("mounts the personal information view", () => {
    render(<PersonalInfoPage />);

    expect(screen.getByText("personal-info-view")).toBeInTheDocument();
  });

  it("mounts the presentation view", () => {
    render(<PresentationPage />);

    expect(screen.getByText("presentation-view")).toBeInTheDocument();
  });

  it("mounts the education view", () => {
    render(<EducationPage />);

    expect(screen.getByText("education-view")).toBeInTheDocument();
  });
});
