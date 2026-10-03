import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { saveMentorParticipation } from "@/shared/services/mentor-participation.service";
import { ParticipationView } from "./participation-view";

describe("ParticipationView", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("muestra la acción para editar tipos de orientación al mentor activo", () => {
    saveMentorParticipation({
      status: "active",
      areas: ["Backend"],
      orientations: ["Orientación técnica"],
    });

    render(<ParticipationView />);

    expect(
      screen.getByRole("link", { name: "Editar tipos de orientación" }),
    ).toHaveAttribute("href", "/mentorship/orientation");
  });

  it("muestra las orientaciones actualizadas al volver a renderizar", () => {
    saveMentorParticipation({
      status: "active",
      areas: ["Backend"],
      orientations: ["Orientación profesional", "Búsqueda de empleo"],
    });

    render(<ParticipationView />);

    expect(screen.getByText("Orientación profesional")).toBeInTheDocument();
    expect(screen.getByText("Búsqueda de empleo")).toBeInTheDocument();
  });
});
