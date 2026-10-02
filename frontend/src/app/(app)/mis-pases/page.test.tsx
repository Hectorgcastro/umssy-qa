import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PassesPage from "./page";

describe("PassesPage", () => {
  it("muestra la vista de Mis pases en desarrollo", () => {
    render(<PassesPage />);

    expect(screen.getByRole("heading", { name: "Mis pases" })).toBeDefined();
    expect(screen.getByText("En desarrollo")).toBeDefined();
  });
});