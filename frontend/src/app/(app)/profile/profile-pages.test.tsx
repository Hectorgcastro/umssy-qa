import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PersonalInfoPage from "./personal-info/page";
import PresentationPage from "./presentation/page";

vi.mock("@/modules/profile", () => ({
  PersonalInfoView: () => <p>personal-info-view</p>,
  PresentationView: () => <p>presentation-view</p>,
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
});
