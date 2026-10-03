import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MentorProfileView } from "./mentor-profile-view";

describe("MentorProfileView", () => {
  it("muestra la información del mentor existente", () => {
    render(<MentorProfileView mentorId="1" />);

    expect(screen.getAllByText("Ana Rojas").length).toBeGreaterThan(0);
    expect(screen.getByText("Arquitecta de Software")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Arquitectura")).toBeInTheDocument();
    expect(screen.getByText("Cloud")).toBeInTheDocument();
  });

  it("muestra mensaje cuando el mentor no existe", () => {
    render(<MentorProfileView mentorId="999" />);

    expect(screen.getByText("Mentor no encontrado")).toBeInTheDocument();
    expect(
      screen.getByText("No se pudo encontrar el perfil solicitado."),
    ).toBeInTheDocument();
  });
});
