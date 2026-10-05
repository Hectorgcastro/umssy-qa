import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MENTOR_DIRECTORY_FIXTURES } from "../fixtures/mentor-directory.fixtures";
import { getMentorDirectory } from "./mentor-query.mock";

beforeEach(() => { vi.useFakeTimers(); window.history.replaceState({}, "", "/"); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); window.history.replaceState({}, "", "/"); });

describe("Temporary mentor directory query service", () => {
  it("returns the directory fixtures", async () => {
    const pending = getMentorDirectory();
    await vi.runAllTimersAsync();
    const directory = await pending;
    expect(directory).toBe(MENTOR_DIRECTORY_FIXTURES);
  });

  it("supports an empty directory in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    window.history.replaceState({}, "", "/?demo=empty");
    const pending = getMentorDirectory();
    await vi.runAllTimersAsync();
    expect(await pending).toEqual([]);
  });

  it("ignores demonstration parameters outside development", async () => {
    window.history.replaceState({}, "", "/?demo=empty");
    const pending = getMentorDirectory();
    await vi.runAllTimersAsync();
    expect(await pending).toHaveLength(6);
  });

  it("cancels an in-flight request", async () => {
    const controller = new AbortController();
    const pending = expect(getMentorDirectory(controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    controller.abort();
    await pending;
  });

  it("rejects an already canceled request", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(getMentorDirectory(controller.signal)).rejects.toMatchObject({ name: "AbortError" });
  });
});

