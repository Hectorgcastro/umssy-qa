import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WorkshopsPage from "./page";

describe("WorkshopsPage", () => {
  it("muestra el placeholder de talleres", () => {
    render(<WorkshopsPage />);

    expect(screen.getByRole("heading", { name: "Talleres" })).toBeDefined();
    expect(screen.getByText("En desarrollo")).toBeDefined();
  });
});