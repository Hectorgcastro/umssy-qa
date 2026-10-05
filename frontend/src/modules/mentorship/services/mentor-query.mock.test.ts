import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMentorProfile } from "./mentor-query.mock";

beforeEach(() => { vi.useFakeTimers(); window.history.replaceState({}, "", "/"); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); window.history.replaceState({}, "", "/"); });

describe("Temporary mentor query service", () => {
  it("returns null for unknown and malformed identifiers", async () => {
    for (const id of ["999", "01", "1abc"]) {
      const pending = getMentorProfile(id);
      await vi.runAllTimersAsync();
      expect(await pending).toBeNull();
    }
  });

  it("simulates one failure followed by a successful retry", async () => {
    vi.stubEnv("NODE_ENV", "development");
    window.history.replaceState({}, "", "/?demo=error");
    const pending = expect(getMentorProfile("3")).rejects.toThrow("No se pudo cargar");
    await vi.runAllTimersAsync();
    await pending;
    const retry = getMentorProfile("3");
    await vi.runAllTimersAsync();
    expect((await retry)?.id).toBe(3);
  });
});
