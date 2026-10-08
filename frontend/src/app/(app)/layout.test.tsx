import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AppLayout from "./layout";

vi.mock("@/shared/components/layout", () => ({
  AppShell: ({ children }: { children: ReactNode }) => (
    <div data-testid="app-shell">{children}</div>
  ),
}));

describe("AppLayout", () => {
  afterEach(() => {
    cleanup();
  });

  it("wraps every authenticated page with the app shell", () => {
    render(
      <AppLayout>
        <p>page-content</p>
      </AppLayout>,
    );

    expect(screen.getByTestId("app-shell")).toContainElement(screen.getByText("page-content"));
  });
});
