import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { ROOT_PATH } from "@/modules/auth/constants/login-redirect.constants";
import { config, proxy } from "./proxy";

describe("proxy", () => {
  it("redirige la raíz al login con 307", () => {
    const response = proxy(new NextRequest("http://localhost:3000/"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it.each(["/login", "/request-access", "/backoffice/solicitudes", "/profile"])("deja pasar %s", (path) => {
    const response = proxy(new NextRequest(`http://localhost:3000${path}`));
    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("location")).toBeNull();
  });

  it("el matcher es solo la raíz exacta", () => {
    expect(config.matcher).toEqual([ROOT_PATH]);
  });

  it.each(["/", "/login", "/request-access", "/backoffice/solicitudes", "/profile", "/api/x", "/_next/static/a.js"])(
    "el matcher %s",
    (path) => {
      const matches = config.matcher.some((pattern) => new RegExp(`^${pattern}$`).test(path));
      expect(matches).toBe(path === "/");
    },
  );
});
