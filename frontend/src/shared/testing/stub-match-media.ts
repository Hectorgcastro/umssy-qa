import { vi } from "vitest";

// jsdom does not implement matchMedia, which the shadcn sidebar needs to
// detect the viewport. Tests restore it with vi.unstubAllGlobals().
export function stubMatchMedia(): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}
