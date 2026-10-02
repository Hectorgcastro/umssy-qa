import { describe, expect, it } from "vitest";
import { getInitials } from "./get-initials";

describe("getInitials", () => {
  it("returns the first letter of the first two words in uppercase", () => {
    expect(getInitials("alejandro vargas rojas")).toBe("AV");
  });

  it("ignores extra spaces between words", () => {
    expect(getInitials("  Alejandro   Vargas ")).toBe("AV");
  });

  it("returns an empty string for an empty name", () => {
    expect(getInitials("")).toBe("");
  });
});
