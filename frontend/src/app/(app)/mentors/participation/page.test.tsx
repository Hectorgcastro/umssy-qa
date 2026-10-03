import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import Page from "./page"

vi.mock("@/modules/mentors/views/participation-view", () => ({
  ParticipationView: () => <div data-testid="participation-view" />,
}))

describe("ParticipationPage", () => {
  afterEach(() => {
    cleanup()
  })

  it("renderiza la vista de participacion del mentor", () => {
    render(<Page />)

    expect(screen.getByTestId("participation-view")).toBeTruthy()
  })
})