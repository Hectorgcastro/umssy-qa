import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/services/api-client";
import { authService } from "./auth.service";

const payload = { email: "ana@umss.edu.bo", password: "contrasena", roleTag: "titulado" as const };

function mockBody(data: unknown) {
  return vi.spyOn(apiClient, "post").mockResolvedValueOnce({ data });
}

describe("authService.login", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("devuelve el cuerpo plano que envía el backend", async () => {
    const postSpy = mockBody({ accessToken: "token-de-prueba", roleTag: "administrativo" });

    const result = await authService.login(payload);

    expect(postSpy).toHaveBeenCalledWith("/auth/login", payload);
    expect(result).toEqual({ accessToken: "token-de-prueba", roleTag: "administrativo" });
  });

  it("devuelve el token que viene dentro del formato estándar de respuesta", async () => {
    mockBody({
      statusCode: 201,
      data: { accessToken: "token-de-prueba", roleTag: "titulado" },
      detail: "Solicitud procesada correctamente",
      ok: true,
    });

    await expect(authService.login(payload)).resolves.toEqual({ accessToken: "token-de-prueba", roleTag: "titulado" });
  });

  it.each([
    ["vacío", undefined],
    ["nulo", null],
    ["sin token", { roleTag: "titulado" }],
    ["sin rol", { accessToken: "token-de-prueba" }],
    ["con token vacío", { accessToken: "", roleTag: "titulado" }],
    ["envuelto sin datos", { statusCode: 201, data: null, detail: "", ok: true }],
    ["envuelto incompleto", { data: { accessToken: "token-de-prueba" } }],
  ])("lanza un error si el cuerpo es %s", async (_caso, body) => {
    mockBody(body);

    await expect(authService.login(payload)).rejects.toThrow("no incluye el token o el rol");
  });
});
