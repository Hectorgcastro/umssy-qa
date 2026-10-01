import { describe, expect, it } from "vitest";
import { getNoResultsMessage } from "./no-results-message";

describe("getNoResultsMessage", () => {
  it.each([
    { searchTerm: "juan.perez@gmail.com", expected: "No se encontró ningún usuario con el correo" },
    { searchTerm: "juan@", expected: "No se encontró ningún usuario con el correo" },
    { searchTerm: "jc.peraz", expected: "No se encontró ningún usuario con el correo" },
    { searchTerm: "201942394", expected: "No se encontró ningún usuario con el identificador" },
    { searchTerm: " 3056218014 ", expected: "No se encontró ningún usuario con el identificador" },
    { searchTerm: "Juan Carlos", expected: "No se encontró ningún usuario con el nombre" },
    { searchTerm: "Gutiérrez", expected: "No se encontró ningún usuario con el nombre" },
  ])('para "$searchTerm" devuelve el mensaje correcto', ({ searchTerm, expected }) => {
    expect(getNoResultsMessage(searchTerm)).toBe(expected);
  });
});
