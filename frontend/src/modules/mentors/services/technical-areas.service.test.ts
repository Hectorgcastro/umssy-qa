import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/services/api-client";
import {
  getMentorTechnicalAreas,
  updateMentorTechnicalAreas,
} from "./technical-areas.service";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("technical areas service", () => {
  const areas = [
    {
      id: "0424f370-00f0-43cf-9b8a-997af81840b9",
      name: "Backend",
      description: "APIs",
    },
  ];

  it("obtiene la seleccion del mentor autenticado", async () => {
    const signal = new AbortController().signal;
    const request = vi
      .spyOn(apiClient, "get")
      .mockResolvedValue({ data: areas });

    await expect(getMentorTechnicalAreas(signal)).resolves.toBe(areas);
    expect(request).toHaveBeenCalledWith("/mentors/me/technical-areas", {
      signal,
    });
  });

  it("persiste exclusivamente los UUID seleccionados", async () => {
    const request = vi
      .spyOn(apiClient, "patch")
      .mockResolvedValue({ data: {} });
    const technicalAreaIds = areas.map((area) => area.id);

    await updateMentorTechnicalAreas(technicalAreaIds);

    expect(request).toHaveBeenCalledWith("/mentors/me/technical-areas", {
      technicalAreaIds,
    });
  });
});
