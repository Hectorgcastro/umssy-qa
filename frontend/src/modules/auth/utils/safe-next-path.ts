import { LOGIN_PATH } from "../constants/login-redirect.constants";
import { MAX_NEXT_LENGTH, NEXT_PARAM } from "../constants/session.constants";
import { isPublicPath } from "./route-access";

const BASE_ORIGIN = "http://localhost";
// Caracteres de control y espacios raros que algunos navegadores quitan al interpretar la URL
const UNSAFE_CHARACTERS = /[\u0000-\u001f\u007f\\]/;

// Devuelve una ruta privada del mismo sitio (ruta, consulta y hash) o null si el valor no es seguro
export function getSafeNextPath(value: string | null | undefined): string | null {
  if (!value || value.length > MAX_NEXT_LENGTH) return null;
  if (!value.startsWith("/") || value.startsWith("//") || UNSAFE_CHARACTERS.test(value)) return null;
  try {
    const url = new URL(value, BASE_ORIGIN);
    if (url.origin !== BASE_ORIGIN) return null;
    if (url.pathname === "/" || url.pathname === LOGIN_PATH || url.pathname.startsWith(`${LOGIN_PATH}/`)) return null;
    if (isPublicPath(url.pathname)) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

// /login?next=<ruta> si la ruta es una ruta privada válida; /login a secas en otro caso
export function buildLoginUrl(path: string | null | undefined): string {
  const next = getSafeNextPath(path);
  return next ? `${LOGIN_PATH}?${NEXT_PARAM}=${encodeURIComponent(next)}` : LOGIN_PATH;
}
