import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { House, User } from "lucide-react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SidebarMenu, SidebarProvider } from "@/components/ui/sidebar";
import { stubMatchMedia } from "@/shared/testing/stub-match-media";
import type { NavigationItem } from "@/shared/types/navigation-item.types";
import { SidebarNavItem } from "./sidebar-nav-item";

const SIMPLE_ITEM: NavigationItem = { label: "Inicio", icon: House, href: "/home" };

const GROUP_ITEM: NavigationItem = {
  label: "Mi perfil",
  icon: User,
  children: [
    { label: "Datos personales", href: "/profile/personal-info" },
    { label: "Documentos", href: "/profile/documents" },
  ],
};

function renderItem(item: NavigationItem, pathname: string) {
  return render(
    <SidebarProvider>
      <SidebarMenu>
        <SidebarNavItem item={item} pathname={pathname} />
      </SidebarMenu>
    </SidebarProvider>,
  );
}

describe("SidebarNavItem", () => {
  beforeEach(() => {
    stubMatchMedia();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("marks a simple item as the current page when its route is active", () => {
    renderItem(SIMPLE_ITEM, "/home");

    const link = screen.getByRole("link", { name: "Inicio" });
    expect(link.getAttribute("href")).toBe("/home");
    expect(link.getAttribute("aria-current")).toBe("page");
  });

  it("does not mark a simple item when its route is not active", () => {
    renderItem(SIMPLE_ITEM, "/profile");

    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("aria-current")).toBeNull();
  });

  it("links to a placeholder when a simple item has no route", () => {
    renderItem({ label: "Inicio", icon: House }, "/home");

    const link = screen.getByRole("link", { name: "Inicio" });
    expect(link.getAttribute("href")).toBe("#");
    expect(link.getAttribute("aria-current")).toBeNull();
  });

  it("opens the group and marks the child when a child route is active", () => {
    renderItem(GROUP_ITEM, "/profile/documents");

    const toggle = screen.getByRole("button", { name: "Mi perfil" });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "Documentos" }).getAttribute("aria-current")).toBe("page");
    expect(
      screen.getByRole("link", { name: "Datos personales" }).getAttribute("aria-current"),
    ).toBeNull();
  });

  it("toggles the children when the group is clicked", () => {
    renderItem(GROUP_ITEM, "/home");

    const toggle = screen.getByRole("button", { name: "Mi perfil" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("link", { name: "Datos personales" })).toBeNull();

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "Datos personales" })).toBeDefined();

    fireEvent.click(toggle);
    expect(screen.queryByRole("link", { name: "Datos personales" })).toBeNull();
  });
});
