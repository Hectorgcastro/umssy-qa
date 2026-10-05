import { describe, it, expect } from "vitest";
import {
  getWeekDayIndex,
  getBlockVerticalPosition,
  capitalize,
} from "./week-grid.utils";

const WEEK_RANGE = {
  startAt: "2026-10-05T04:00:00.000Z",
  endAt: "2026-10-12T03:59:59.999Z",
};

describe("getWeekDayIndex", () => {
  it("ubica un bloque del martes 18:00 Bolivia en la columna 1", () => {
    expect(getWeekDayIndex("2026-10-06T22:00:00.000Z", WEEK_RANGE)).toBe(1);
  });

  it("devuelve null para un bloque de otra semana", () => {
    expect(getWeekDayIndex("2026-10-13T22:00:00.000Z", WEEK_RANGE)).toBeNull();
  });

  it("ubica correctamente un bloque cuya hora UTC cae al día siguiente", () => {
    expect(getWeekDayIndex("2026-10-06T02:00:00.000Z", WEEK_RANGE)).toBe(0);
  });
});

describe("getBlockVerticalPosition", () => {
  it("calcula el top y la altura correctos para un bloque de 1 hora", () => {
    const { topPx, heightPx } = getBlockVerticalPosition(
      "2026-10-06T22:00:00.000Z", // 18:00 Bolivia
      "2026-10-06T23:00:00.000Z", // 19:00 Bolivia
      7,
      22
    );
    expect(topPx).toBe(11 * 25);
    expect(heightPx).toBe(25);
  });

  it("recorta un bloque que se pasa del final de la grilla", () => {
    const { heightPx } = getBlockVerticalPosition(
      "2026-10-06T23:30:00.000Z",
      "2026-10-07T03:00:00.000Z",
      7,
      22
    );
    expect(heightPx).toBeCloseTo(150 * (25 / 60), 1);
  });
});

describe("capitalize", () => {
  it("pone en mayúscula la primera letra", () => {
    expect(capitalize("libre")).toBe("Libre");
  });
});