import type { MentorParticipationState } from "@/shared/types/mentor-participation-state.types";

const STORAGE_KEY = "umssy-mentor-participation";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isMentorParticipationState(value: unknown): value is MentorParticipationState {
  if (!value || typeof value !== "object") return false;

  const state = value as Record<string, unknown>;
  return (
    state.status === "active" &&
    isStringArray(state.areas) &&
    isStringArray(state.orientations)
  );
}

export function getMentorParticipation(): MentorParticipationState | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const state: unknown = JSON.parse(stored);
    return isMentorParticipationState(state) ? state : null;
  } catch {
    return null;
  }
}

export function saveMentorParticipation(state: MentorParticipationState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateMentorParticipation(
  changes: Partial<Pick<MentorParticipationState, "areas" | "orientations">>,
): MentorParticipationState {
  const current = getMentorParticipation();
  if (!current) {
    throw new Error("Mentor participation must be activated before it can be updated");
  }

  const updated = { ...current, ...changes };
  saveMentorParticipation(updated);
  return updated;
}
