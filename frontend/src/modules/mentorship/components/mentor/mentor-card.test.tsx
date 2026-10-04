import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { MentorDirectoryItem } from "../../types/mentor-directory.types";
import { MentorCard } from "./mentor-card";

const mentor: MentorDirectoryItem = {
  id: "1",
  fullName: "María Fernanda Rodríguez",
  jobTitle: "Desarrolladora Backend Senior",
  technicalAreas: ["Backend", "APIs", "Bases de datos"],
  isAvailable: true,
};

afterEach(cleanup);

describe("MentorCard", () => {
  it("renderiza la información principal del mentor", () => {
    render(<MentorCard mentor={mentor} />);

    expect(screen.getByText(mentor.fullName)).toBeDefined();
    expect(screen.getByText("Desarrolladora Backend Senior")).toBeDefined();
    expect(screen.getByText("Backend")).toBeDefined();
    expect(screen.getByText("APIs")).toBeDefined();
    expect(screen.getByText("Bases de datos")).toBeDefined();
    expect(screen.getByText("Disponible")).toBeDefined();
  });

  it("muestra un valor alternativo cuando el cargo no está registrado", () => {
    render(
      <MentorCard
        mentor={{
          ...mentor,
          jobTitle: null,
        }}
      />,
    );

    expect(screen.getByText("Cargo no registrado")).toBeDefined();
  });

  it("muestra el estado no disponible", () => {
    render(
      <MentorCard
        mentor={{
          ...mentor,
          isAvailable: false,
        }}
      />,
    );

    expect(screen.getByText("No disponible")).toBeDefined();
  });

  it("renderiza múltiples áreas técnicas", () => {
    render(<MentorCard mentor={mentor} />);

    expect(screen.getByText("Backend")).toBeDefined();
    expect(screen.getByText("APIs")).toBeDefined();
    expect(screen.getByText("Bases de datos")).toBeDefined();
  });

  it("enlaza el perfil utilizando el ID correcto del mentor", () => {
    render(<MentorCard mentor={mentor} />);

    const profileLink = screen.getByRole("link", {
      name: `Ver perfil de ${mentor.fullName}`,
    });

    expect(profileLink.getAttribute("href")).toBe("/mentors/1");
  });

  it("genera la ruta correcta para el mentor con ID 2", () => {
    render(
      <MentorCard
        mentor={{
          ...mentor,
          id: "2",
          fullName: "Carlos Andrés Vargas",
        }}
      />,
    );

    const profileLink = screen.getByRole("link", {
      name: "Ver perfil de Carlos Andrés Vargas",
    });

    expect(profileLink.getAttribute("href")).toBe("/mentors/2");
  });

  it("muestra un mensaje cuando no existen áreas técnicas", () => {
    render(
      <MentorCard
        mentor={{
          ...mentor,
          technicalAreas: [],
        }}
      />,
    );

    expect(screen.getByText("Sin áreas registradas")).toBeDefined();
  });
});
