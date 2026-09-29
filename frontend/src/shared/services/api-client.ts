import axios from "axios";
import { ENV_CONFIG } from "@/shared/config/env.config";

export const apiClient = axios.create({
  baseURL: ENV_CONFIG.apiUrl,
});