import { SKILLS_ERROR_MESSAGES_BY_STATUS } from "../config/skills-messages.config";
import type { HttpError } from "../types/http-error.types";

export function getSkillsErrorMessage(error: unknown, fallbackMessage: string): string {
  if (typeof error !== "object" || error === null) {
    return fallbackMessage;
  }

  const status = (error as HttpError).response?.status;

  if (typeof status !== "number") {
    return fallbackMessage;
  }

  return SKILLS_ERROR_MESSAGES_BY_STATUS[status] ?? fallbackMessage;
}
