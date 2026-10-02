import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { homeService } from "../services/home.service";
import { useHome } from "./use-home";

describe("useHome", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("muestra el mensaje cuando la API responde correctamente", async () => {
    vi.spyOn(homeService, "getWelcomeMessage").mockResolvedValueOnce(
      "API disponible",
    );

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.backendMessage).toBe("API disponible");
    });
  });

  it("muestra un mensaje de error cuando falla la API", async () => {
    vi.spyOn(homeService, "getWelcomeMessage").mockRejectedValueOnce(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.backendMessage).toBe("Error connecting to backend");
    });
  });
});