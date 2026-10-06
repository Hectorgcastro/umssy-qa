import { apiClient } from "@/shared/services/api-client";
import { REVIEW_PAGE_SIZE } from "../constants/request-review.constants";
import type { ReviewApiResult, ReviewListResult, ReviewStatus } from "../types/request-review.types";
import { getSessionToken } from "../utils/session";

const NETWORK_ERROR_MESSAGE = "No se pudo conectar con el servidor. Inténtalo de nuevo.";
const GENERIC_ERROR_MESSAGE = "No se pudo completar la operación. Inténtalo de nuevo.";
const SESSION_EXPIRED_MESSAGE = "Tu sesión expiró. Inicia sesión de nuevo.";
const FORBIDDEN_MESSAGE = "No tienes permiso para ver las solicitudes.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function failureOf(status: number, body: unknown): ReviewApiResult<never> {
  if (status === 401) return { ok: false, status, message: SESSION_EXPIRED_MESSAGE };
  if (status === 403) return { ok: false, status, message: FORBIDDEN_MESSAGE };
  if (isRecord(body) && typeof body.detail === "string") return { ok: false, status, message: body.detail };
  return { ok: false, status, message: GENERIC_ERROR_MESSAGE };
}

export function authHeaders(): Record<string, string> {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lista { data: { items, total }, page, offset }; el cuerpo puede venir envuelto en el formato estándar o no
async function listRequests(
  status: ReviewStatus,
  page: number,
  limit: number = REVIEW_PAGE_SIZE,
): Promise<ReviewApiResult<ReviewListResult>> {
  try {
    const response = await apiClient.get("/access-requests", {
      params: { status, page, limit },
      headers: authHeaders(),
      validateStatus: () => true,
    });
    if (response.status < 200 || response.status >= 300) return failureOf(response.status, response.data);

    const body: unknown = response.data;
    const payload = isRecord(body) && isRecord(body.data) ? body.data : null;
    const items = payload && Array.isArray(payload.items) ? payload.items : null;
    if (!isRecord(body) || !payload || !items || typeof payload.total !== "number") {
      return { ok: false, status: 0, message: GENERIC_ERROR_MESSAGE };
    }
    return {
      ok: true,
      data: {
        items: items as ReviewListResult["items"],
        total: payload.total,
        page: typeof body.page === "number" ? body.page : page,
        offset: typeof body.offset === "number" ? body.offset : (page - 1) * limit,
      },
    };
  } catch {
    return { ok: false, status: 0, message: NETWORK_ERROR_MESSAGE };
  }
}

export const requestReviewService = { listRequests };
