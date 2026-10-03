import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SidebarUserCard } from "./sidebar-user-card";

describe("SidebarUserCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows the user name, role and initials", () => {
    render(<SidebarUserCard user={{ fullName: "Alejandro Vargas", role: "Administrador" }} />);

    expect(screen.getByText("Alejandro Vargas")).toBeDefined();
    expect(screen.getByText("Administrador")).toBeDefined();
    expect(screen.getByText("AV")).toBeDefined();
  });
});
