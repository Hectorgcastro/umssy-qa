import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ManagementMenu } from "./management-menu";

describe("ManagementMenu", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 4));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("abre el menú con Todas y las gestiones desde la actual hacia atrás", () => {
    render(<ManagementMenu />);

    const toggle = screen.getByRole("button", { name: "Gestión" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("menu")).toBeNull();

    fireEvent.click(toggle);

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const options = screen.getAllByRole("menuitemradio").map((option) => option.textContent);
    expect(options.slice(0, 5)).toEqual(["Todas", "2-2026", "1-2026", "2-2025", "1-2025"]);
    expect(options.at(-1)).toBe("1-2020");
  });

  it("marca Todas cuando no hay gestión seleccionada", () => {
    render(<ManagementMenu />);
    fireEvent.click(screen.getByRole("button", { name: "Gestión" }));

    expect(screen.getByRole("menuitemradio", { name: "Todas" }).getAttribute("aria-checked")).toBe("true");
  });

  it("muestra la gestión seleccionada en el botón y la marca en el menú", () => {
    render(<ManagementMenu value="1-2025" />);

    fireEvent.click(screen.getByRole("button", { name: "Gestión 1-2025" }));

    expect(screen.getByRole("menuitemradio", { name: "1-2025" }).getAttribute("aria-checked")).toBe("true");
  });

  it("avisa la gestión elegida y undefined al elegir Todas", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<ManagementMenu onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Gestión" }));
    await user.click(screen.getByRole("menuitemradio", { name: "2-2025" }));
    expect(onChange).toHaveBeenLastCalledWith("2-2025");

    rerender(<ManagementMenu value="2-2025" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Gestión 2-2025" }));
    await user.click(screen.getByRole("menuitemradio", { name: "Todas" }));
    expect(onChange).toHaveBeenLastCalledWith(undefined);
  });

  it("cierra el menú al volver a hacer clic en el botón", () => {
    render(<ManagementMenu />);
    const toggle = screen.getByRole("button", { name: "Gestión" });

    fireEvent.click(toggle);
    fireEvent.click(toggle);

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("cierra el menú al hacer clic fuera", () => {
    render(<ManagementMenu />);
    fireEvent.click(screen.getByRole("button", { name: "Gestión" }));

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("cierra el menú con la tecla Escape", () => {
    render(<ManagementMenu />);
    fireEvent.click(screen.getByRole("button", { name: "Gestión" }));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("menu")).toBeNull();
  });
});
