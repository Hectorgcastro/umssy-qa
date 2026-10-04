import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/services/api-client";
import { skillsService } from "./skills.service";

vi.mock("@/shared/services/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

const PYTHON_ID = "33333333-3333-4333-8333-333333333333";
const PYTHON_RESPONSE = { id: PYTHON_ID, name: "Python", isCustom: false };
const PYTHON_ITEM = { id: PYTHON_ID, name: "Python" };

function wrapResponse<T>(data: T) {
  return { data: { statusCode: 200, data, detail: "OK", ok: true } };
}

describe("skillsService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("gets the skills catalog", async () => {
    vi.mocked(apiClient.get).mockResolvedValue(wrapResponse([PYTHON_RESPONSE]));

    await expect(skillsService.getCatalog()).resolves.toEqual([PYTHON_ITEM]);
    expect(apiClient.get).toHaveBeenCalledWith("/skills");
  });

  it("gets the skills of the current user", async () => {
    vi.mocked(apiClient.get).mockResolvedValue(wrapResponse([PYTHON_RESPONSE]));

    await expect(skillsService.getMySkills()).resolves.toEqual([PYTHON_ITEM]);
    expect(apiClient.get).toHaveBeenCalledWith("/profile/me/skills");
  });

  it("registers a custom skill", async () => {
    vi.mocked(apiClient.post).mockResolvedValue(wrapResponse(PYTHON_RESPONSE));

    await expect(skillsService.createCustomSkill("Python")).resolves.toEqual(PYTHON_ITEM);
    expect(apiClient.post).toHaveBeenCalledWith("/skills/custom", { name: "Python" });
  });

  it("saves the skills of the current user", async () => {
    vi.mocked(apiClient.put).mockResolvedValue(wrapResponse([PYTHON_RESPONSE]));

    await expect(skillsService.saveMySkills([PYTHON_ID])).resolves.toEqual([PYTHON_ITEM]);
    expect(apiClient.put).toHaveBeenCalledWith("/profile/me/skills", { skillIds: [PYTHON_ID] });
  });
});
