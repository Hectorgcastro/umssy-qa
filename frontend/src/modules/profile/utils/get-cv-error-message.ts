import { CV_ERROR_MESSAGES_BY_STATUS } from "../config/cv-error-messages.config";
import type { HttpError } from "../types/http-error.types";

export function getCvErrorMessage(error: unknown, fallbackMessage: string): string {
  if (typeof error !== "object" || error === null) {
    return fallbackMessage;
  }

  const status = (error as HttpError).response?.status;

  if (typeof status !== "number") {
    return fallbackMessage;
  }

  return CV_ERROR_MESSAGES_BY_STATUS[status] ?? fallbackMessage;
}
