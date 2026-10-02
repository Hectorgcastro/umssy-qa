import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/services/api-client";
import { homeService } from "./home.service";

describe("homeService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("obtiene el mensaje de bienvenida desde la API", async () => {
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValueOnce({
      data: "API disponible",
    });

    await expect(homeService.getWelcomeMessage()).resolves.toBe("API disponible");
    expect(getSpy).toHaveBeenCalledWith("/");
  });
});