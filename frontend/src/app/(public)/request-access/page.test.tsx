import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import RequestAccessPage, { metadata } from "./page";

describe("RequestAccessPage", () => {
  afterEach(() => cleanup());

  it("renderiza la vista de solicitud de acceso", () => {
    render(<RequestAccessPage />);

    expect(screen.getByRole("heading", { name: "Solicita tu acceso a la comunidad" })).toBeInTheDocument();
  });

  it("define el título de la página", () => {
    expect(metadata.title).toBe("Solicitud de acceso");
  });
});
