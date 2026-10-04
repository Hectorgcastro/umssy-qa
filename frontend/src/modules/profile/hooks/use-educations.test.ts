import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EDUCATION_FEEDBACK_MESSAGES } from "../config/education-feedback.config";
import { educationsService } from "../services/educations.service";
import type { EducationItem } from "../types/education-item.types";
import { useEducations } from "./use-educations";

vi.mock("../services/educations.service", () => ({
  educationsService: { getEducations: vi.fn() },
}));

const EDUCATION: EducationItem = {
  id: "11111111-1111-4111-8111-111111111111",
  institution: "Example University",
  degree: "Computer Science",
  startDate: "2021-02-01",
  endDate: null,
  description: null,
  createdAt: "2025-12-01T00:00:00.000Z",
  updatedAt: "2025-12-01T00:00:00.000Z",
};

describe("useEducations", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("loads records while preserving the order returned by the backend", async () => {
    const records = [EDUCATION, { ...EDUCATION, id: "22222222-2222-4222-8222-222222222222" }];
    vi.mocked(educationsService.getEducations).mockResolvedValue(records);
    const { result } = renderHook(() => useEducations());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.educations).toEqual(records);
    expect(result.current.error).toBeNull();
  });

  it("completes loading when the user has no records", async () => {
    vi.mocked(educationsService.getEducations).mockResolvedValue([]);
    const { result } = renderHook(() => useEducations());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.educations).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("reports a Spanish error instead of exposing backend details", async () => {
    vi.mocked(educationsService.getEducations).mockRejectedValue(new Error("Invalid token"));
    const { result } = renderHook(() => useEducations());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.educations).toEqual([]);
    expect(result.current.error).toBe(EDUCATION_FEEDBACK_MESSAGES.loadError);
  });

  it("ignores a successful response after unmounting", async () => {
    let resolveRequest!: (records: EducationItem[]) => void;
    const request = new Promise<EducationItem[]>((resolve) => {
      resolveRequest = resolve;
    });
    vi.mocked(educationsService.getEducations).mockReturnValue(request);
    const { result, unmount } = renderHook(() => useEducations());
    unmount();

    await act(async () => {
      resolveRequest([EDUCATION]);
    });

    expect(result.current.educations).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it("ignores a failed response after unmounting", async () => {
    let rejectRequest!: (error: Error) => void;
    const request = new Promise<EducationItem[]>((_, reject) => {
      rejectRequest = reject;
    });
    vi.mocked(educationsService.getEducations).mockReturnValue(request);
    const { result, unmount } = renderHook(() => useEducations());
    unmount();

    await act(async () => {
      rejectRequest(new Error("Network Error"));
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it("reloads the records on demand", async () => {
    vi.mocked(educationsService.getEducations).mockResolvedValueOnce([]);
    const { result } = renderHook(() => useEducations());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.mocked(educationsService.getEducations).mockResolvedValueOnce([EDUCATION]);
    await act(async () => {
      await result.current.reload();
    });

    expect(result.current.educations).toEqual([EDUCATION]);
    expect(result.current.error).toBeNull();
  });
});
