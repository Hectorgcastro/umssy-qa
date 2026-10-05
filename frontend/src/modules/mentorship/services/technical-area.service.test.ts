import { apiClient } from "@/shared/services/api-client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getTechnicalAreas } from "./technical-area.service";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getTechnicalAreas", () => {
  it("returns the technical areas from the API", async () => {
    const technicalAreas = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Backend",
        description: "Desarrollo backend",
      },
    ];
    const request = vi.spyOn(apiClient, "get").mockResolvedValue({
      data: technicalAreas,
    });

    const result = await getTechnicalAreas();

    expect(request).toHaveBeenCalledWith("/technical-areas");
    expect(result).toBe(technicalAreas);
  });
});
