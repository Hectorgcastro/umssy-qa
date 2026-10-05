import axios from "axios";
import { ENV_CONFIG } from "@/shared/config/env.config";

export const apiClient = axios.create({
  baseURL: ENV_CONFIG.apiUrl || "http://127.0.0.1:8080/api",
});