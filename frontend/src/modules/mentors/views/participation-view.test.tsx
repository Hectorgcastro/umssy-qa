import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
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

  it("mantiene un estado inicial estable mientras resuelve la participación", () => {
    saveMentorParticipation({
      status: "active",
      areas: ["Backend"],
      orientations: ["Orientación técnica"],
    });

    const html = renderToString(<ParticipationView />);

    expect(html).toContain("Cargando participación...");
    expect(html).not.toContain("Mi participación como mentor");
    expect(html).not.toContain("Participa como mentor");
  });

  it("muestra la participación activa con sus datos y enlaces de edición", async () => {
    saveMentorParticipation({
      status: "active",
      areas: ["Backend", "QA"],
      orientations: ["Orientación profesional", "Búsqueda de empleo"],
    });

    render(<ParticipationView />);

    expect(
      await screen.findByRole("heading", { name: "Mi participación como mentor" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("QA")).toBeInTheDocument();
    expect(screen.getByText("Orientación profesional")).toBeInTheDocument();
    expect(screen.getByText("Búsqueda de empleo")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Editar áreas técnicas" }),
    ).toHaveAttribute("href", "/mentors/participation/technical-areas");
    expect(
      screen.getByRole("link", { name: "Editar tipos de orientación" }),
    ).toHaveAttribute("href", "/mentorship/orientation");
  });

  it("muestra la activación cuando no existe participación", async () => {
    render(<ParticipationView />);

    expect(
      await screen.findByRole("heading", { name: "Mi participación" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Participa como mentor" }),
    ).toHaveAttribute("href", "/mentorship");
  });
});
