import { ADMINISTRATIVE_ROLE_TAG, BACKOFFICE_HOME_PATH } from "../constants/login-redirect.constants";
import { getPostLoginPath } from "./get-post-login-path";
import { getSafeNextPath } from "./safe-next-path";

const BACKOFFICE_PREFIX = "/backoffice";
const isBackofficePath = (path: string) => path === BACKOFFICE_PREFIX || path.startsWith(`${BACKOFFICE_PREFIX}/`);

// Destino tras iniciar sesión: la ruta pedida (?next) si es privada y válida para el rol; si no, el destino por defecto del rol
export function resolvePostLoginPath(roleTag: string | null | undefined, next: string | null | undefined): string {
  const fallback = getPostLoginPath(roleTag);
  const safeNext = getSafeNextPath(next);
  if (!safeNext) return fallback;
  const isAdministrative = roleTag === ADMINISTRATIVE_ROLE_TAG;
  // El backoffice es solo del rol administrativo y el administrativo no vuelve a pantallas de otros roles
  if (isAdministrative) return isBackofficePath(safeNext) ? safeNext : BACKOFFICE_HOME_PATH;
  return isBackofficePath(safeNext) ? fallback : safeNext;
}
