import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getMentorParticipation,
  saveMentorParticipation,
  updateMentorParticipation,
} from "./mentor-participation.service";

describe("mentor participation storage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns null when participation has not been stored", () => {
    expect(getMentorParticipation()).toBeNull();
  });

  it("stores and reads the complete participation state", () => {
    const state = {
      status: "active" as const,
      areas: ["Backend"],
      orientations: ["Orientación técnica"],
    };

    saveMentorParticipation(state);

    expect(getMentorParticipation()).toEqual(state);
  });

  it("preserves areas when orientations are updated", () => {
    saveMentorParticipation({
      status: "active",
      areas: ["Backend", "Cloud"],
      orientations: ["Orientación técnica"],
    });

    expect(
      updateMentorParticipation({ orientations: ["Orientación profesional"] }),
    ).toEqual({
      status: "active",
      areas: ["Backend", "Cloud"],
      orientations: ["Orientación profesional"],
    });
  });

  it("rejects a partial update when participation has not been activated", () => {
    expect(() => updateMentorParticipation({ areas: ["QA"] })).toThrow(
      "Mentor participation must be activated before it can be updated",
    );
    expect(localStorage.getItem("umssy-mentor-participation")).toBeNull();
  });

  it.each(["not json", JSON.stringify({ status: "active" })])(
    "ignores invalid stored data",
    (stored) => {
      localStorage.setItem("umssy-mentor-participation", stored);
      expect(getMentorParticipation()).toBeNull();
    },
  );
});
