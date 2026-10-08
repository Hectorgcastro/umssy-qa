import { apiClient } from "@/shared/services/api-client";
import type { LoginPayload, LoginResponse } from "../types/auth-types";

function isLoginResponse(value: unknown): value is LoginResponse {
  if (typeof value !== "object" || value === null) return false;
  const { accessToken, roleTag } = value as Record<string, unknown>;
  return typeof accessToken === "string" && accessToken !== "" && typeof roleTag === "string" && roleTag !== "";
}

// El backend responde plano ({ accessToken, roleTag }); con el interceptor de respuesta viene dentro de data
function extractLoginResponse(body: unknown): LoginResponse {
  const wrapped = typeof body === "object" && body !== null ? (body as { data?: unknown }).data : undefined;
  const candidate = isLoginResponse(wrapped) ? wrapped : body;
  if (!isLoginResponse(candidate)) {
    throw new Error("La respuesta del inicio de sesión no incluye el token o el rol");
  }
  return { accessToken: candidate.accessToken, roleTag: candidate.roleTag };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<unknown>("/auth/login", payload);
    return extractLoginResponse(response.data);
  },
};
