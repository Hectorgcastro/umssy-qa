import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getMentorParticipation,
  saveMentorParticipation,
} from "@/shared/services/mentor-participation.service";
import { ORIENTATION_TYPES } from "../data/orientation-types";
import { OrientationConfigView } from "./orientation-config-view";

const activeParticipation = {
  status: "active" as const,
  areas: ["Backend", "Cloud"],
  orientations: ["Orientación técnica", "Búsqueda de empleo"],
};

describe("OrientationConfigView", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("renderiza un estado inicial estable mientras resuelve la participación", () => {
    const markup = renderToString(<OrientationConfigView />);

    expect(markup).toContain("Cargando tu participación como mentor");
    expect(markup).not.toContain("Activar participación como mentor");
    expect(markup).not.toContain("Guardar cambios");
  });

  it("precarga las orientaciones guardadas durante la activación", async () => {
    saveMentorParticipation(activeParticipation);

    render(<OrientationConfigView />);

    await screen.findByRole("checkbox", { name: "Orientación técnica" });
    expect(screen.getByRole("checkbox", { name: "Orientación técnica" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Búsqueda de empleo" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Orientación profesional" })).not.toBeChecked();
  });

  it("muestra exactamente el catálogo compartido por HU3", async () => {
    saveMentorParticipation(activeParticipation);

    render(<OrientationConfigView />);

    await screen.findByRole("checkbox", { name: "Orientación técnica" });
    expect(screen.getAllByRole("checkbox")).toHaveLength(ORIENTATION_TYPES.length);
    ORIENTATION_TYPES.forEach(({ name }) => {
      expect(screen.getByRole("checkbox", { name: name })).toBeInTheDocument();
    });
  });

  it("permite agregar y quitar múltiples orientaciones", async () => {
    saveMentorParticipation(activeParticipation);

    render(<OrientationConfigView />);

    await screen.findByRole("checkbox", { name: "Orientación técnica" });
    const professional = screen.getByRole("checkbox", { name: "Orientación profesional" });
    const technical = screen.getByRole("checkbox", { name: "Orientación técnica" });

    fireEvent.click(professional);
    fireEvent.click(technical);

    expect(professional).toBeChecked();
    expect(technical).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Búsqueda de empleo" })).toBeChecked();
  });

  it("impide guardar cuando no queda ninguna orientación seleccionada", async () => {
    saveMentorParticipation({
      ...activeParticipation,
      orientations: ["Orientación técnica"],
    });

    render(<OrientationConfigView />);
    await screen.findByRole("checkbox", { name: "Orientación técnica" });
    fireEvent.click(screen.getByRole("checkbox", { name: "Orientación técnica" }));

    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeDisabled();
    expect(getMentorParticipation()).toEqual({
      ...activeParticipation,
      orientations: ["Orientación técnica"],
    });
  });

  it("guarda las etiquetas elegidas y preserva áreas y estado", async () => {
    saveMentorParticipation(activeParticipation);

    render(<OrientationConfigView />);
    await screen.findByRole("checkbox", { name: "Orientación técnica" });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Orientación profesional" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Orientación técnica" }));
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(getMentorParticipation()).toEqual({
      status: "active",
      areas: ["Backend", "Cloud"],
      orientations: ["Orientación profesional", "Búsqueda de empleo"],
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Tipos de orientación actualizados correctamente",
    );
  });

  it("mantiene Volver dirigido a Mi participación", async () => {
    saveMentorParticipation(activeParticipation);

    render(<OrientationConfigView />);

    await screen.findByRole("link", { name: "Volver" });
    expect(screen.getByRole("link", { name: "Volver" })).toHaveAttribute(
      "href",
      "/mentors/participation",
    );
  });

  it("bloquea la edición sin participación y enlaza al flujo de activación", async () => {
    render(<OrientationConfigView />);

    expect(
      await screen.findByText(/Primero debes activar tu participación como mentor/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Activar participación como mentor" }),
    ).toHaveAttribute("href", "/mentorship");
  });
});
