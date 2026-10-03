import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getMentorParticipation,
  saveMentorParticipation,
} from "@/shared/services/mentor-participation.service";
import { loadMentorAreas, saveMentorAreas, MOCK_MENTOR_AREA_IDS } from "./technical-areas.mock";

describe("demo technical area persistence", () => {
  beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

  it("loads initial areas before the first save", async () => {
    expect(await loadMentorAreas()).toEqual(MOCK_MENTOR_AREA_IDS);
  });

  it("reloads the saved selection instead of the initial mock", async () => {
    saveMentorParticipation({
      status: "active",
      areas: ["Backend"],
      orientations: ["Orientación técnica"],
    });
    await saveMentorAreas([2, 4]);
    expect(await loadMentorAreas()).toEqual([2, 4]);
    expect(getMentorParticipation()?.areas).toEqual(["Desarrollo Web", "QA"]);
  });

  it("preserves the existing orientations when areas are saved", async () => {
    saveMentorParticipation({
      status: "active",
      areas: ["Backend"],
      orientations: ["Preparación para entrevistas"],
    });

    await saveMentorAreas([4, 5]);

    expect(getMentorParticipation()).toEqual({
      status: "active",
      areas: ["QA", "Datos"],
      orientations: ["Preparación para entrevistas"],
    });
  });

  it("rejects empty saves without overwriting the saved selection", async () => {
    saveMentorParticipation({
      status: "active",
      areas: ["Backend"],
      orientations: ["Orientación técnica"],
    });
    await saveMentorAreas([2]);
    await expect(saveMentorAreas([])).rejects.toThrow();
    expect(await loadMentorAreas()).toEqual([2]);
  });

  it("reports storage failures", async () => {
    saveMentorParticipation({
      status: "active",
      areas: ["Backend"],
      orientations: ["Orientación técnica"],
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage unavailable"); });
    await expect(saveMentorAreas([1])).rejects.toThrow("Storage unavailable");
  });
});
