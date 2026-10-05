import { apiClient } from "@/shared/services/api-client";
import type {
  AccessRequestPayload,
  ApiResult,
  CreateAccessRequestResponse,
  FieldErrors,
} from "../types/access-request.types";

const NETWORK_ERROR_MESSAGE = "No se pudo conectar con el servidor. Inténtalo de nuevo.";
const GENERIC_ERROR_MESSAGE = "No se pudo completar la solicitud. Inténtalo de nuevo.";
const NOT_FOUND_MESSAGE = "La solicitud ya no existe";

const KNOWN_FIELDS = [
  "firstName",
  "lastName",
  "idCardNumber",
  "idCardIssuedIn",
  "sisCode",
  "email",
  "phone",
  "birthDate",
  "graduationYear",
  "career",
] as const;

// Palabras con las que el backend nombra los campos repetidos en el 409
const DUPLICATE_WORDS: ReadonlyArray<[string, keyof FieldErrors]> = [
  ["correo", "email"],
  ["carnet", "idCardNumber"],
  ["código sis", "sisCode"],
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function failure(status: number, message: string, fieldErrors: FieldErrors = {}): ApiResult<never> {
  return { ok: false, status, fieldErrors, message };
}

// 400 de Zod: message es un arreglo de issues { path, message, ... }
function fromZodIssues(issues: unknown[]): ApiResult<never> {
  const fieldErrors: FieldErrors = {};
  let generalMessage: string | undefined;
  for (const issue of issues) {
    if (!isRecord(issue) || typeof issue.message !== "string") continue;
    const path = Array.isArray(issue.path) ? issue.path : [];
    const field = KNOWN_FIELDS.find((name) => name === path[0]);
    if (field) {
      fieldErrors[field] ??= issue.message;
    } else {
      generalMessage ??= issue.message;
    }
  }
  const hasFields = Object.keys(fieldErrors).length > 0;
  return failure(
    400,
    generalMessage ?? (hasFields ? "Revisa los campos marcados" : GENERIC_ERROR_MESSAGE),
    fieldErrors,
  );
}

// Errores de dominio: { statusCode, data: null, detail, ok: false }
function fromDomainError(status: number, detail: string): ApiResult<never> {
  const fieldErrors: FieldErrors = {};
  const text = detail.toLowerCase();
  if (status === 409) {
    for (const [word, field] of DUPLICATE_WORDS) {
      if (text.includes(word)) fieldErrors[field] = detail;
    }
  } else if (text.includes("año de titulación")) {
    fieldErrors.graduationYear = detail;
  }
  return failure(status, detail, fieldErrors);
}

function parseError(status: number, body: unknown): ApiResult<never> {
  if (status === 404) return failure(404, NOT_FOUND_MESSAGE);
  if (!isRecord(body)) return failure(0, NETWORK_ERROR_MESSAGE);
  if (Array.isArray(body.message)) return fromZodIssues(body.message);
  if (typeof body.detail === "string") return fromDomainError(status, body.detail);
  if (typeof body.message === "string") return failure(status, body.message);
  return failure(status, GENERIC_ERROR_MESSAGE);
}

async function send<T>(
  method: "post" | "patch",
  url: string,
  payload: AccessRequestPayload,
): Promise<ApiResult<T>> {
  try {
    // Endpoints públicos: sin token. validateStatus evita que axios lance en errores HTTP
    const response = await apiClient.request({
      method,
      url,
      data: payload,
      validateStatus: () => true,
    });
    if (response.status >= 200 && response.status < 300) {
      if (!isRecord(response.data)) return failure(0, NETWORK_ERROR_MESSAGE);
      return { ok: true, data: response.data as T };
    }
    return parseError(response.status, response.data);
  } catch {
    return failure(0, NETWORK_ERROR_MESSAGE);
  }
}

export const accessRequestService = {
  createAccessRequest: (payload: AccessRequestPayload) =>
    send<CreateAccessRequestResponse>("post", "/access-requests", payload),
  updateAccessRequest: (id: string, payload: AccessRequestPayload) =>
    send<unknown>("patch", `/access-requests/${id}`, payload),
};
