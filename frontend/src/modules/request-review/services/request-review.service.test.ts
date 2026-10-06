import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/services/api-client";
import { requestReviewService } from "./request-review.service";

const get = vi.spyOn(apiClient, "get");
const reply = (status: number, data: unknown) => get.mockResolvedValue({ status, data } as never);
const item = { id: "1", fullName: "Ana Pérez" };

describe("requestReviewService.listRequests", () => {
  beforeEach(() => {
    get.mockReset();
    sessionStorage.setItem("accessToken", "token-de-prueba");
  });
  afterEach(() => sessionStorage.clear());

  it("envía el estado, la página, el límite y el token Bearer", async () => {
    reply(200, { data: { items: [item], total: 11 }, page: 2, offset: 10 });

    const result = await requestReviewService.listRequests("pending", 2, 10);

    expect(result).toEqual({ ok: true, data: { items: [item], total: 11, page: 2, offset: 10 } });
    expect(get).toHaveBeenCalledWith(
      "/access-requests",
      expect.objectContaining({ params: { status: "pending", page: 2, limit: 10 }, headers: { Authorization: "Bearer token-de-prueba" } }),
    );
  });

  it("usa la página pedida si el cuerpo no trae page ni offset, y el límite por defecto", async () => {
    reply(200, { data: { items: [], total: 0 } });

    const result = await requestReviewService.listRequests("approved", 3);

    expect(result).toEqual({ ok: true, data: { items: [], total: 0, page: 3, offset: 20 } });
  });

  it("sin token no envía la cabecera de autorización", async () => {
    sessionStorage.clear();
    reply(401, { detail: "Debes iniciar sesión para continuar" });

    await requestReviewService.listRequests("pending", 1);

    expect(get.mock.calls[0][1]?.headers).toEqual({});
  });

  it.each([
    [401, "Tu sesión expiró. Inicia sesión de nuevo."],
    [403, "No tienes permiso para ver las solicitudes."],
  ])("traduce el %d a un mensaje en español", async (status, message) => {
    reply(status, { detail: "texto del servidor" });
    expect(await requestReviewService.listRequests("pending", 1)).toEqual({ ok: false, status, message });
  });

  it("usa el detalle de los errores de dominio y un texto genérico si no hay", async () => {
    reply(409, { detail: "Conflicto" });
    expect(await requestReviewService.listRequests("pending", 1)).toMatchObject({ ok: false, status: 409, message: "Conflicto" });
    reply(500, "<html>");
    expect(await requestReviewService.listRequests("pending", 1)).toMatchObject({ ok: false, status: 500, message: "No se pudo completar la operación. Inténtalo de nuevo." });
  });

  it.each([[{}], ["texto"], [{ data: { items: "x", total: 1 } }], [{ data: { items: [], total: "1" } }]])("un 200 con cuerpo inválido %j da error", async (body) => {
    reply(200, body);
    expect(await requestReviewService.listRequests("pending", 1)).toMatchObject({ ok: false, status: 0 });
  });

  it("devuelve error de conexión si la petición falla", async () => {
    get.mockRejectedValue(new Error("red"));
    expect(await requestReviewService.listRequests("pending", 1)).toEqual({
      ok: false,
      status: 0,
      message: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
    });
  });
});
