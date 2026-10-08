import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_PATH, ROOT_PATH } from "@/modules/auth/constants/login-redirect.constants";

// La sesión vive en sessionStorage y el servidor no la lee: el proxy solo manda la raíz exacta al login
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== ROOT_PATH) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL(LOGIN_PATH, request.url), 307);
}

// El matcher debe ser un literal para que Next lo analice al compilar (equivale a ROOT_PATH)
export const config = {
  matcher: ["/"],
};
