import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSaveWorkExperience } from "./use-save-work-experience";

const service = vi.hoisted(() => ({
  createWorkExperience: vi.fn(),
  updateWorkExperience: vi.fn(),
}));
vi.mock("../services/work-experience.service", () => ({
  workExperienceService: service,
}));

describe("Saved experience analysis (#221)", () => {
  afterEach(() => vi.resetAllMocks());
  const payload = {
    companyName: "UMSS",
    position: "Dev",
    startDate: "2024-01-01",
    endDate: null,
    isCurrent: true,
    description: "Python",
  };
  it("uses backend analysis rather than inventing skills", async () => {
    service.createWorkExperience.mockResolvedValue({
      detectedSkills: ["Python"],
      processingTimeMs: 12,
    });
    const onSaved = vi.fn();
    const { result } = renderHook(() => useSaveWorkExperience(onSaved));
    await act(() => result.current.save(payload));
    expect(result.current.analysis).toEqual({
      skills: ["Python"],
      processingTimeMs: 12,
    });
    expect(onSaved).toHaveBeenCalledOnce();
    expect(result.current.isSaving).toBe(false);
  });
  it("refreshes chips after clearing an edited description", async () => {
    service.updateWorkExperience.mockResolvedValue({
      detectedSkills: [],
      processingTimeMs: 0,
    });
    const { result } = renderHook(() => useSaveWorkExperience(vi.fn()));
    await act(() => result.current.save({ ...payload, description: "" }, "e"));
    expect(service.updateWorkExperience).toHaveBeenCalledWith("e", {
      ...payload,
      description: "",
    });
    expect(result.current.analysis?.skills).toEqual([]);
  });
  it("does not claim a successful analysis when saving fails", async () => {
    service.createWorkExperience.mockRejectedValue(new Error("offline"));
    const onSaved = vi.fn();
    const { result } = renderHook(() => useSaveWorkExperience(onSaved));
    await act(() => result.current.save(payload));
    expect(result.current.analysis).toBeNull();
    expect(result.current.feedback?.type).toBe("error");
    expect(onSaved).not.toHaveBeenCalled();
  });
});
