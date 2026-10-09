import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_HOME_PATH, LOGIN_PATH, ROOT_PATH } from "@/modules/auth/constants/login-redirect.constants";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE } from "@/modules/auth/constants/session.constants";
import { isOpenPath } from "@/modules/auth/utils/route-access";
import { buildLoginUrl } from "@/modules/auth/utils/safe-next-path";

// Solo comodidad de navegación: el token está en sessionStorage y el servidor no lo ve, así que el proxy se guía por una cookie
// marcadora (sin token). Cualquiera puede crearla a mano; la seguridad real son los guards del backend.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.get(SESSION_COOKIE_NAME)?.value === SESSION_COOKIE_VALUE;

  if (pathname === ROOT_PATH) {
    return NextResponse.redirect(new URL(hasSession ? DEFAULT_HOME_PATH : LOGIN_PATH, request.url), 307);
  }
  // Rutas públicas y la de pases (uso sin conexión) pasan siempre; con cookie, /login no se redirige (lo decide el cliente)
  if (isOpenPath(pathname) || hasSession) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL(buildLoginUrl(`${pathname}${search}`), request.url), 307);
}

// El matcher debe ser un literal para que Next lo analice al compilar. Excluye _next/static, _next/image, favicon.ico,
// manifest.json, sw.js, icons/ y cualquier archivo con extensión de public/
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/|.*\\..*).*)"],
};
