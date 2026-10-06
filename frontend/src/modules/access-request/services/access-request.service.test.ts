import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/services/api-client";
import type { AccessRequestPayload } from "../types/access-request.types";
import { accessRequestService } from "./access-request.service";

vi.mock("@/shared/services/api-client", () => ({ apiClient: { request: vi.fn() } }));

const request = vi.mocked(apiClient.request);

const payload: AccessRequestPayload = {
  firstName: "Ana",
  lastName: "Rojas",
  idCardNumber: "123",
  idCardIssuedIn: "LP",
  sisCode: "456",
  email: "ana@umss.edu.bo",
  birthDate: "2000-05-10",
  graduationYear: 2019,
  career: "Licenciatura en Ingeniería de Sistemas",
};

function reply(status: number, data: unknown) {
  request.mockResolvedValue({ status, data } as never);
}

describe("accessRequestService", () => {
  beforeEach(() => {
    request.mockReset();
  });

  it("createAccessRequest hace POST sin cabecera de autorización y devuelve { id }", async () => {
    reply(201, { id: "id-1" });

    const result = await accessRequestService.createAccessRequest(payload);

    expect(result).toEqual({ ok: true, data: { id: "id-1" } });
    const config = request.mock.calls[0][0];
    expect(config).toMatchObject({ method: "post", url: "/access-requests", data: payload });
    expect(config?.headers).toBeUndefined();
  });

  it.each([
    ["sin id", {}],
    ["con id numérico", { id: 123 }],
    ["con id vacío", { id: "" }],
    ["con id solo de espacios", { id: "   " }],
    ["con id nulo", { id: null }],
  ])("createAccessRequest con 201 %s devuelve el error con status 0", async (_name, body) => {
    reply(201, body);

    const result = await accessRequestService.createAccessRequest(payload);

    expect(result).toEqual({
      ok: false,
      status: 0,
      fieldErrors: {},
      message: "No se pudo completar la solicitud. Inténtalo de nuevo.",
    });
  });

  it("updateAccessRequest hace PATCH al id", async () => {
    reply(200, { id: "id-1" });

    const result = await accessRequestService.updateAccessRequest("id-1", payload);

    expect(result.ok).toBe(true);
    expect(request.mock.calls[0][0]).toMatchObject({ method: "patch", url: "/access-requests/id-1" });
  });

  it("normaliza el 400 de Zod a fieldErrors por campo", async () => {
    reply(400, {
      message: [
        { code: "invalid_value", values: ["a"], path: ["career"], message: "La carrera no es válida" },
        { code: "custom", path: ["graduationYear"], message: "El año de titulación no puede ser futuro" },
        { code: "custom", path: ["career"], message: "segundo mensaje ignorado" },
      ],
      error: "Bad Request",
      statusCode: 400,
    });

    const result = await accessRequestService.createAccessRequest(payload);

    expect(result).toEqual({
      ok: false,
      status: 400,
      fieldErrors: {
        career: "La carrera no es válida",
        graduationYear: "El año de titulación no puede ser futuro",
      },
      message: "Revisa los campos marcados",
    });
  });

  it("usa el mensaje de un issue sin campo como mensaje general", async () => {
    reply(400, { message: [{ code: "custom", path: [], message: "Debes enviar al menos un campo para actualizar" }], statusCode: 400 });

    const result = await accessRequestService.updateAccessRequest("id-1", payload);

    expect(result).toMatchObject({ ok: false, status: 400, fieldErrors: {}, message: "Debes enviar al menos un campo para actualizar" });
  });

  it("toma detail de los errores de dominio", async () => {
    reply(400, { statusCode: 400, data: null, detail: "La solicitud ya fue enviada", ok: false });

    const result = await accessRequestService.updateAccessRequest("id-1", payload);

    expect(result).toEqual({ ok: false, status: 400, fieldErrors: {}, message: "La solicitud ya fue enviada" });
  });

  it("mapea la coherencia del año de titulación a graduationYear", async () => {
    const detail = "El año de titulación no puede ser anterior a los 18 años de edad";
    reply(400, { statusCode: 400, data: null, detail, ok: false });

    const result = await accessRequestService.updateAccessRequest("id-1", payload);

    expect(result).toMatchObject({ ok: false, status: 400, fieldErrors: { graduationYear: detail }, message: detail });
  });

  it("mapea el 409 con un solo campo repetido", async () => {
    const detail = "El correo ya está registrado";
    reply(409, { statusCode: 409, data: null, detail, ok: false });

    const result = await accessRequestService.createAccessRequest(payload);

    expect(result).toEqual({ ok: false, status: 409, fieldErrors: { email: detail }, message: detail });
  });

  it("mapea el 409 con varios campos repetidos", async () => {
    const detail = "El correo, el carnet de identidad y el código SIS ya están registrados";
    reply(409, { statusCode: 409, data: null, detail, ok: false });

    const result = await accessRequestService.createAccessRequest(payload);

    expect(result).toEqual({
      ok: false,
      status: 409,
      fieldErrors: { email: detail, idCardNumber: detail, sisCode: detail },
      message: detail,
    });
  });

  it("mapea el 409 de carnet y código SIS sin tocar el correo", async () => {
    const detail = "El carnet de identidad y el código SIS ya están registrados";
    reply(409, { statusCode: 409, data: null, detail, ok: false });

    const result = await accessRequestService.createAccessRequest(payload);

    expect(result).toMatchObject({ fieldErrors: { idCardNumber: detail, sisCode: detail } });
    expect(result.ok === false && result.fieldErrors.email).toBeUndefined();
  });

  it("devuelve el 404 con el mensaje fijo y sin campo", async () => {
    reply(404, { statusCode: 404, data: null, detail: "Solicitud no encontrada", ok: false });

    const result = await accessRequestService.updateAccessRequest("id-1", payload);

    expect(result).toEqual({ ok: false, status: 404, fieldErrors: {}, message: "La solicitud ya no existe" });
  });

  it("devuelve status 0 ante un fallo de red", async () => {
    request.mockRejectedValue(new Error("Network Error"));

    const result = await accessRequestService.createAccessRequest(payload);

    expect(result).toEqual({
      ok: false,
      status: 0,
      fieldErrors: {},
      message: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
    });
  });

  it("devuelve status 0 si el cuerpo no es JSON válido", async () => {
    reply(201, "<html>no es json</html>");
    expect(await accessRequestService.createAccessRequest(payload)).toMatchObject({ ok: false, status: 0 });

    reply(502, "<html>Bad Gateway</html>");
    expect(await accessRequestService.createAccessRequest(payload)).toMatchObject({ ok: false, status: 0 });
  });

  it("usa un mensaje genérico o el mensaje de texto de Nest en otros errores", async () => {
    reply(500, { statusCode: 500 });
    expect(await accessRequestService.createAccessRequest(payload)).toMatchObject({ ok: false, status: 500, message: "No se pudo completar la solicitud. Inténtalo de nuevo." });

    reply(400, { statusCode: 400, message: "Validation failed (uuid is expected)", error: "Bad Request" });
    expect(await accessRequestService.updateAccessRequest("x", payload)).toMatchObject({ ok: false, status: 400, message: "Validation failed (uuid is expected)" });
  });
});
