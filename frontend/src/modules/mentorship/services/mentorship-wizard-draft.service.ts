import type { MentorshipWizardState } from "../types/mentorship-wizard-state.types";

const STORAGE_KEY = "umssy-mentorship-wizard-draft";

export function saveMentorshipWizardDraft(
  state: MentorshipWizardState,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadMentorshipWizardDraft(): MentorshipWizardState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as MentorshipWizardState;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearMentorshipWizardDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}