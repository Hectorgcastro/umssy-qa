import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import Page from "./page"

vi.mock("@/modules/mentors", () => ({
  TechnicalAreasView: ({ mode }: { mode: string }) => (
    <div data-testid="technical-areas-view" data-mode={mode} />
  ),
}))

describe("ParticipationTechnicalAreasPage", () => {
  afterEach(() => {
    cleanup()
  })

  it("renderiza la vista de areas tecnicas en modo edicion", () => {
    render(<Page />)

    expect(
      screen.getByTestId("technical-areas-view").getAttribute("data-mode"),
    ).toBe("edit")
  })
})