import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExportCsvButton } from "./export-csv-button";

describe("ExportCsvButton", () => {
  afterEach(() => {
    cleanup();
  });

  it("abre un menú para elegir qué exportar", () => {
    render(<ExportCsvButton hasActiveFilters />);

    const toggle = screen.getByRole("button", { name: "Exportar CSV" });
    expect(screen.queryByRole("menu")).toBeNull();

    fireEvent.click(toggle);

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const options = screen.getAllByRole("menuitem").map((option) => option.textContent);
    expect(options).toEqual(["Exportar todo", "Exportar según filtros"]);
  });

  it.each([
    { option: "Exportar todo", scope: "all" },
    { option: "Exportar según filtros", scope: "filtered" },
  ])('exporta con alcance "$scope" al elegir "$option"', ({ option, scope }) => {
    const onExport = vi.fn();
    render(<ExportCsvButton onExport={onExport} hasActiveFilters />);

    fireEvent.click(screen.getByRole("button", { name: "Exportar CSV" }));
    fireEvent.click(screen.getByRole("menuitem", { name: option }));

    expect(onExport).toHaveBeenCalledWith(scope);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("deshabilita la opción de filtros cuando no hay filtros activos", () => {
    const onExport = vi.fn();
    render(<ExportCsvButton onExport={onExport} />);

    fireEvent.click(screen.getByRole("button", { name: "Exportar CSV" }));
    const filteredOption = screen.getByRole("menuitem", { name: "Exportar según filtros" });
    fireEvent.click(filteredOption);

    expect(filteredOption.getAttribute("aria-disabled")).toBe("true");
    expect(onExport).not.toHaveBeenCalled();
  });

  it("deshabilita el botón mientras exporta", () => {
    render(<ExportCsvButton isExporting />);

    const toggle = screen.getByRole("button", { name: "Exportando..." });
    expect(toggle.getAttribute("aria-busy")).toBe("true");
    fireEvent.click(toggle);

    expect(screen.queryByRole("menu")).toBeNull();
  });
});
