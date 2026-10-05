import { describe, expect, it } from "vitest";
import { getAcademicPeriods } from "./academic-periods";

describe("getAcademicPeriods", () => {
  it("empieza en la gestión actual del segundo semestre", () => {
    expect(getAcademicPeriods(new Date(2026, 9, 4), 2025)).toEqual(["2-2026", "1-2026", "2-2025", "1-2025"]);
  });

  it("no incluye el segundo semestre si todavía no empezó", () => {
    expect(getAcademicPeriods(new Date(2026, 5, 30), 2025)).toEqual(["1-2026", "2-2025", "1-2025"]);
  });
});
