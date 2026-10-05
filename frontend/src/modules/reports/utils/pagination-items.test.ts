import { describe, expect, it } from "vitest";
import { getPaginationItems } from "./pagination-items";

describe("getPaginationItems", () => {
  it.each([
    { totalPages: 1, expected: [1] },
    { totalPages: 3, expected: [1, 2, 3] },
    { totalPages: 7, expected: [1, 2, 3, 4, 5, 6, 7] },
  ])("muestra todas las páginas cuando son $totalPages o menos de 8", ({ totalPages, expected }) => {
    expect(getPaginationItems(1, totalPages)).toEqual(expected);
  });

  it.each([
    { currentPage: 1, expected: [1, 2, 3, 4, 5, "ellipsis-end", 20] },
    { currentPage: 4, expected: [1, 2, 3, 4, 5, "ellipsis-end", 20] },
    { currentPage: 5, expected: [1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 20] },
    { currentPage: 10, expected: [1, "ellipsis-start", 9, 10, 11, "ellipsis-end", 20] },
    { currentPage: 16, expected: [1, "ellipsis-start", 15, 16, 17, "ellipsis-end", 20] },
    { currentPage: 17, expected: [1, "ellipsis-start", 16, 17, 18, 19, 20] },
    { currentPage: 20, expected: [1, "ellipsis-start", 16, 17, 18, 19, 20] },
  ])("en la página $currentPage de 20 usa elipsis en los saltos", ({ currentPage, expected }) => {
    expect(getPaginationItems(currentPage, 20)).toEqual(expected);
  });

  it("siempre incluye la página actual, la primera y la última, sin repetir", () => {
    for (let currentPage = 1; currentPage <= 30; currentPage++) {
      const pages = getPaginationItems(currentPage, 30).filter((item) => typeof item === "number");

      expect(pages).toContain(currentPage);
      expect(pages[0]).toBe(1);
      expect(pages.at(-1)).toBe(30);
      expect(new Set(pages).size).toBe(pages.length);
      expect(getPaginationItems(currentPage, 30)).toHaveLength(7);
    }
  });
});
