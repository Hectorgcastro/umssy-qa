import { MENTORSHIP_WIZARD_DRAFT_STORAGE_KEY } from "../constants/mentorship-wizard.constants";
import type { MentorshipWizardState } from "../types/mentorship-wizard-state.types";

export function saveMentorshipWizardDraft(
  state: MentorshipWizardState,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    MENTORSHIP_WIZARD_DRAFT_STORAGE_KEY,
    JSON.stringify(state),
  );
}

export function loadMentorshipWizardDraft(): MentorshipWizardState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(
    MENTORSHIP_WIZARD_DRAFT_STORAGE_KEY,
  );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as MentorshipWizardState;
  } catch {
    window.localStorage.removeItem(MENTORSHIP_WIZARD_DRAFT_STORAGE_KEY);
    return null;
  }
}

export function clearMentorshipWizardDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(MENTORSHIP_WIZARD_DRAFT_STORAGE_KEY);
}
