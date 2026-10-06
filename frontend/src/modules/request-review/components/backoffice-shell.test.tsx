import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { stubMatchMedia } from "@/shared/testing/stub-match-media";
import { BackofficeShell } from "./backoffice-shell";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/backoffice/solicitudes",
  useRouter: () => ({ replace }),
}));

const tokenFor = (roleTag: string) => `h.${btoa(JSON.stringify({ sub: "u1", roleTag }))}.s`;

describe("BackofficeShell", () => {
  beforeEach(() => {
    stubMatchMedia();
    replace.mockReset();
  });
  afterEach(() => {
    cleanup();
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("un administrativo ve el layout con la opción Solicitudes y su contenido", () => {
    sessionStorage.setItem("accessToken", tokenFor("administrativo"));
    render(
      <BackofficeShell>
        <p>Contenido del backoffice</p>
      </BackofficeShell>,
    );

    expect(screen.getByText("Contenido del backoffice")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitudes" })).toHaveAttribute("href", "/backoffice/solicitudes");
    expect(screen.getByText("Personal administrativo")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("sin token redirige al login y no muestra el contenido", async () => {
    render(
      <BackofficeShell>
        <p>Contenido del backoffice</p>
      </BackofficeShell>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText("Contenido del backoffice")).toBeNull();
  });

  it.each(["titulado", "estudiante", "mentor", "empresa"])("el rol %s es redirigido al inicio", async (role) => {
    sessionStorage.setItem("accessToken", tokenFor(role));
    render(
      <BackofficeShell>
        <p>Contenido del backoffice</p>
      </BackofficeShell>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
    expect(screen.queryByText("Contenido del backoffice")).toBeNull();
  });

  it("Cerrar sesión borra el token y va al login", () => {
    sessionStorage.setItem("accessToken", tokenFor("administrativo"));
    render(
      <BackofficeShell>
        <p>Contenido</p>
      </BackofficeShell>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Cerrar sesión/ }));

    expect(sessionStorage.getItem("accessToken")).toBeNull();
    expect(replace).toHaveBeenCalledWith("/login");
  });
});
