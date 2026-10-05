import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithQuery } from "@/shared/testing/render-with-query";
import { MENTOR_DIRECTORY_FIXTURES } from "../fixtures/mentor-directory.fixtures";
import * as profileService from "../services/mentor-profile.service";
import * as directoryService from "../services/mentor-query.mock";
import { MENTOR_PROFILE_FIXTURE } from "../testing/mentor-profile.fixture";
import { MentorDirectoryView } from "./mentor-directory-view";
import { MentorProfileView } from "./mentor-profile-view";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Directory and profile query flows", () => {
  it("hides profile links during loading and then shows all six profiles", async () => {
    vi.spyOn(directoryService, "getMentorDirectory").mockResolvedValue(
      MENTOR_DIRECTORY_FIXTURES,
    );
    renderWithQuery(<MentorDirectoryView />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(
      await screen.findAllByRole("link", { name: /Ver perfil de/ }),
    ).toHaveLength(6);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows an informative empty state without fabricated cards", async () => {
    vi.spyOn(directoryService, "getMentorDirectory").mockResolvedValue([]);
    renderWithQuery(<MentorDirectoryView />);
    expect(
      await screen.findByText("No hay perfiles disponibles"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("retries a failed directory query and replaces the error with results", async () => {
    const request = vi
      .spyOn(directoryService, "getMentorDirectory")
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue(MENTOR_DIRECTORY_FIXTURES);
    renderWithQuery(<MentorDirectoryView />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos cargar el directorio",
    );
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(
      await screen.findAllByRole("link", { name: /Ver perfil de/ }),
    ).toHaveLength(6);
    expect(request).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("retries a failed profile query using the UUID real", async () => {
    const request = vi
      .spyOn(profileService, "getMentorProfile")
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue(MENTOR_PROFILE_FIXTURE);
    renderWithQuery(
      <MentorProfileView mentorId={MENTOR_PROFILE_FIXTURE.id} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Cargando perfil");
    await screen.findByRole("alert");
    expect(
      screen.getByRole("link", { name: "Volver al directorio" }),
    ).toHaveAttribute("href", "/mentorship/mentors");
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(
      await screen.findByRole("heading", { name: "Ana Rojas" }),
    ).toBeInTheDocument();
    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenLastCalledWith(
      MENTOR_PROFILE_FIXTURE.id,
      expect.any(AbortSignal),
    );
  });

  it("keeps the error actionable without falling back to a fixture", async () => {
    const request = vi
      .spyOn(profileService, "getMentorProfile")
      .mockRejectedValue(new Error("offline"));
    renderWithQuery(
      <MentorProfileView mentorId={MENTOR_PROFILE_FIXTURE.id} />,
    );
    await screen.findByRole("alert");
    expect(screen.queryByText("Ana Rojas")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
    expect(
      await screen.findByRole("button", { name: "Reintentar" }),
    ).toBeEnabled();
    expect(screen.queryByText("Ana Rojas")).not.toBeInTheDocument();
  });

  it("provides a return link for an invalid or nonexistent mentor", async () => {
    vi.spyOn(profileService, "getMentorProfile").mockResolvedValue(null);
    renderWithQuery(
      <MentorProfileView mentorId="not-a-valid-mentor-id" />,
    );
    await screen.findByText("Mentor no encontrado");
    expect(
      screen.getByRole("link", { name: "Volver al directorio" }),
    ).toHaveAttribute("href", "/mentorship/mentors");
  });
});
