import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithQuery } from "@/shared/testing/render-with-query";
import { MENTOR_PROFILES } from "../fixtures/mentor-profiles.fixtures";
import * as directoryService from "../services/mentor-directory.service";
import * as profileService from "../services/mentor-query.mock";
import { MentorDirectoryView } from "./mentor-directory-view";
import { MentorProfileView } from "./mentor-profile-view";

const mentors = [
  {
    id: "0424f370-00f0-43cf-9b8a-997af81840b9",
    fullName: "María Fernanda Rodríguez",
    headline: "Desarrolladora Backend Senior",
    technicalAreas: ["Backend", "APIs"],
  },
  {
    id: "0fa5e6de-63a4-430e-87fb-22f5eb700ecd",
    fullName: "Carlos Andrés Vargas",
    headline: null,
    technicalAreas: [],
  },
];

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Directory and profile query flows", () => {
  it("hides profile links during loading and then shows active mentors", async () => {
    vi.spyOn(directoryService, "getMentorDirectory").mockResolvedValue(mentors);
    renderWithQuery(<MentorDirectoryView />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(await screen.findAllByRole("link", { name: /Ver perfil de/ })).toHaveLength(2);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows an informative empty state without fabricated cards", async () => {
    vi.spyOn(directoryService, "getMentorDirectory").mockResolvedValue([]);
    renderWithQuery(<MentorDirectoryView />);
    expect(await screen.findByText("No hay mentores activos")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("retries a failed directory query and replaces the error with results", async () => {
    const request = vi.spyOn(directoryService, "getMentorDirectory")
      .mockRejectedValueOnce(new Error("offline")).mockResolvedValue(mentors);
    renderWithQuery(<MentorDirectoryView />);
    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos cargar el directorio");
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(await screen.findAllByRole("link", { name: /Ver perfil de/ })).toHaveLength(2);
    expect(request).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("retries a failed profile query and retains a return link on error", async () => {
    const request = vi.spyOn(profileService, "getMentorProfile")
      .mockRejectedValueOnce(new Error("offline")).mockResolvedValue(MENTOR_PROFILES[0]);
    renderWithQuery(<MentorProfileView mentorId="1" />);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando perfil");
    await screen.findByRole("alert");
    expect(screen.getByRole("link", { name: "Volver al directorio" })).toHaveAttribute("href", "/mentorship/mentors");
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(await screen.findByRole("heading", { name: "Ana Rojas" })).toBeInTheDocument();
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("keeps the error actionable if the retry also fails", async () => {
    const request = vi.spyOn(profileService, "getMentorProfile").mockRejectedValue(new Error("offline"));
    renderWithQuery(<MentorProfileView mentorId="1" />);
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeEnabled();
  });

  it("provides a return link for a nonexistent profile", async () => {
    vi.spyOn(profileService, "getMentorProfile").mockResolvedValue(null);
    renderWithQuery(<MentorProfileView mentorId="999" />);
    await screen.findByText("Mentor no encontrado");
    expect(screen.getByRole("link", { name: "Volver al directorio" })).toHaveAttribute("href", "/mentorship/mentors");
  });
});

