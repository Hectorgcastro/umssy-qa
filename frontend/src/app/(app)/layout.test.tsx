import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AppLayout from "./layout";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("AppLayout", () => {
  it("mantiene el sidebar alrededor de la página activa", () => {
    render(
      <AppLayout params={Promise.resolve({})}>
        <p>Contenido de la página</p>
      </AppLayout>,
    );

    expect(screen.getByRole("complementary")).toBeDefined();
    expect(screen.getByRole("main")).toContainElement(
      screen.getByText("Contenido de la página"),
    );
  });
});