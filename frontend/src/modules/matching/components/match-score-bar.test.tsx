import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MatchScoreBar } from "./match-score-bar";

describe("Compatibility bar (#276)", () => {
  afterEach(cleanup);
  it.each([
    [0, 0],
    [49.8, 50],
    [100, 100],
    [125, 100],
    [-10, 0],
    [NaN, 0],
  ])("renders %s safely", (value, score) => {
    render(<MatchScoreBar value={value} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      String(score),
    );
    expect(screen.getByText(`${score}%`)).toBeInTheDocument();
  });
});
