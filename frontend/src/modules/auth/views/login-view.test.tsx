import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { saveAccessToken } from "@/shared/services/storage/access-token-storage";
import { useLogin } from "../hooks/use-login";
import { LoginView } from "./login-view";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("../hooks/use-login", () => ({
  useLogin: vi.fn(),
}));

vi.mock("@/shared/services/storage/access-token-storage", () => ({
  saveAccessToken: vi.fn(),
}));

describe("LoginView", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("stores the returned access token and redirects after a successful login", async () => {
    const login = vi.fn().mockResolvedValue({
      accessToken: "returned-token",
      roleTag: "titulado",
    });
    vi.mocked(useLogin).mockReturnValue({ login, isLoading: false, error: null });

    render(<LoginView />);

    fireEvent.change(screen.getByPlaceholderText("nombre@ejemplo.com"), {
      target: { value: "person@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "secret" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Iniciar sesión" }).closest("form")!);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "person@example.com",
        password: "secret",
        roleTag: "titulado",
      });
      expect(saveAccessToken).toHaveBeenCalledWith("returned-token");
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  async function submitLogin(login: unknown) {
    vi.mocked(useLogin).mockReturnValue({ login: login as ReturnType<typeof useLogin>["login"], isLoading: false, error: null });
    render(<LoginView />);
    fireEvent.change(screen.getByPlaceholderText("nombre@ejemplo.com"), { target: { value: "person@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("********"), { target: { value: "secret" } });
    fireEvent.submit(screen.getByRole("button", { name: "Iniciar sesión" }).closest("form")!);
  }

  it("el administrativo va a la bandeja del backoffice", async () => {
    await submitLogin(vi.fn().mockResolvedValue({ accessToken: "t-admin", roleTag: "administrativo" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/backoffice/solicitudes"));
    expect(push).toHaveBeenCalledTimes(1);
  });

  it.each(["titulado", "estudiante", "mentor", "empresa", "", "desconocido"])("el rol %j va a la ruta actual", async (roleTag) => {
    await submitLogin(vi.fn().mockResolvedValue({ accessToken: "t", roleTag }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/"));
    expect(push).toHaveBeenCalledTimes(1);
  });

  it("un login fallido no guarda el token ni redirige", async () => {
    await submitLogin(vi.fn().mockResolvedValue(null));

    await waitFor(() => expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeInTheDocument());
    expect(saveAccessToken).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("el token queda guardado antes de navegar", async () => {
    await submitLogin(vi.fn().mockResolvedValue({ accessToken: "t-admin", roleTag: "administrativo" }));

    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(vi.mocked(saveAccessToken).mock.invocationCallOrder[0]).toBeLessThan(push.mock.invocationCallOrder[0]);
    expect(saveAccessToken).toHaveBeenCalledWith("t-admin");
  });
});
