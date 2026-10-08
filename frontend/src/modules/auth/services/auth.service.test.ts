import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/services/api-client";
import { authService } from "./auth.service";

describe("authService.login", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("devuelve el token que viene dentro del formato estándar de respuesta", async () => {
    const postSpy = vi.spyOn(apiClient, "post").mockResolvedValueOnce({
      data: {
        statusCode: 201,
        data: { accessToken: "token-de-prueba", roleTag: "titulado" },
        detail: "Solicitud procesada correctamente",
        ok: true,
      },
    });
    const payload = { email: "ana@umss.edu.bo", password: "contrasena", roleTag: "titulado" as const };

    const result = await authService.login(payload);

    expect(postSpy).toHaveBeenCalledWith("/auth/login", payload);
    expect(result).toEqual({ accessToken: "token-de-prueba", roleTag: "titulado" });
  });
});
