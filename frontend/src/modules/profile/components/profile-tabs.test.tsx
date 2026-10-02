import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProfileTabs } from "./profile-tabs";

describe("ProfileTabs", () => {
  afterEach(() => {
    cleanup();
  });

  it("links the available tabs and marks the active one", () => {
    render(<ProfileTabs activeTab="personal-info" />);

    const personalInfoTab = screen.getByRole("link", { name: "Datos personales" });
    const presentationTab = screen.getByRole("link", { name: "Presentación" });

    expect(personalInfoTab).toHaveAttribute("href", "/profile/personal-info");
    expect(personalInfoTab).toHaveAttribute("aria-current", "page");
    expect(presentationTab).toHaveAttribute("href", "/profile/presentation");
    expect(presentationTab).not.toHaveAttribute("aria-current");
  });

  it("shows the unavailable tabs as disabled text", () => {
    render(<ProfileTabs activeTab="presentation" />);

    expect(screen.getByRole("link", { name: "Trayectoria" })).toHaveAttribute(
      "href",
      "/profile/trajectory/education",
    );
    expect(screen.queryByRole("link", { name: "Documentos" })).not.toBeInTheDocument();
    expect(screen.getByText("Documentos")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("Documentos")).toHaveAttribute("title", "Disponible próximamente");
  });
});
