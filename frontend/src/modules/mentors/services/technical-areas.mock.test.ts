import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadMentorAreas, saveMentorAreas, MOCK_MENTOR_AREA_IDS } from "./technical-areas.mock";

describe("demo technical area persistence", () => {
  beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

  it("loads initial areas before the first save", async () => {
    expect(await loadMentorAreas()).toEqual(MOCK_MENTOR_AREA_IDS);
  });

  it("reloads the saved selection instead of the initial mock", async () => {
    await saveMentorAreas([2, 4]);
    expect(await loadMentorAreas()).toEqual([2, 4]);
  });

  it("rejects empty saves without overwriting the saved selection", async () => {
    await saveMentorAreas([2]);
    await expect(saveMentorAreas([])).rejects.toThrow();
    expect(await loadMentorAreas()).toEqual([2]);
  });

  it("reports storage failures", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage unavailable"); });
    await expect(saveMentorAreas([1])).rejects.toThrow("Storage unavailable");
  });
});
