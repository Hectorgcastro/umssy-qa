import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  clearMentorshipWizardDraft,
  saveMentorshipWizardDraft,
} from "../services/mentorship-wizard-draft.service"; 
import { useMentorshipWizard } from "./use-mentorship-wizard";

afterEach(() => {
  clearMentorshipWizardDraft();
});

describe("useMentorshipWizard", () => {
  it("recupera el draft guardado al montar", async () => {
    saveMentorshipWizardDraft({
      currentStep: 3,
      wantsToParticipate: true,
      selectedTechnicalAreaIds: ["technical-area-1"],
      selectedOrientationTypeIds: ["orientation-type-1"],
    });

    const { result } = renderHook(() => useMentorshipWizard());

    await waitFor(() => {
      expect(result.current.currentStep).toBe(3);
    });

    expect(result.current.wantsToParticipate).toBe(true);
    expect(result.current.selectedTechnicalAreaIds).toEqual([
      "technical-area-1",
    ]);
    expect(result.current.selectedOrientationTypeIds).toEqual([
      "orientation-type-1",
    ]);
  });

  it("guarda los cambios del wizard como draft", async () => {
    const { result } = renderHook(() => useMentorshipWizard());

    act(() => {
      result.current.setState({
        currentStep: 2,
        wantsToParticipate: true,
        selectedTechnicalAreaIds: ["technical-area-1"],
        selectedOrientationTypeIds: [],
      });
    });

    await waitFor(() => {
      expect(localStorage.getItem("umssy-mentorship-wizard-draft")).toBe(
        JSON.stringify({
          currentStep: 2,
          wantsToParticipate: true,
          selectedTechnicalAreaIds: ["technical-area-1"],
          selectedOrientationTypeIds: [],
        }),
      );
    });
  });
});