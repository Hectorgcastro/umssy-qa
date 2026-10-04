import type { HttpError } from "../types/http-error.types";

// Returns the HTTP status of a failed request, or undefined for network and unknown errors.
export function getHttpStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const status = (error as HttpError).response?.status;
  return typeof status === "number" ? status : undefined;
}
