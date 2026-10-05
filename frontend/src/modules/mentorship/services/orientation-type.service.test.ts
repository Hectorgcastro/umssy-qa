import { apiClient } from "@/shared/services/api-client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getOrientationTypes } from "./orientation-type.service";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getOrientationTypes", () => {
  it("returns the orientation types from the API", async () => {
    const orientationTypes = [
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Orientación profesional",
        description: null,
      },
    ];
    const request = vi.spyOn(apiClient, "get").mockResolvedValue({
      data: orientationTypes,
    });

    const result = await getOrientationTypes();

    expect(request).toHaveBeenCalledWith("/orientation-types");
    expect(result).toBe(orientationTypes);
  });
});
