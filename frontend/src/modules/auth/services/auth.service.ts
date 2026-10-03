import { apiClient } from "@/shared/services/api-client";
import type { ApiResponse } from "@/shared/types/api-response.types";
import type { LoginPayload, LoginResponse } from "../types/auth-types";

export const authService = {
  // El backend responde con el formato estándar { statusCode, data, detail, ok }.
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/login", payload);
    return response.data.data;
  },
};
