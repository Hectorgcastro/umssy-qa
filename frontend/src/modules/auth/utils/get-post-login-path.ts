import { ADMINISTRATIVE_ROLE_TAG, BACKOFFICE_HOME_PATH, DEFAULT_HOME_PATH } from "../constants/login-redirect.constants";

// Solo el rol administrativo va al backoffice; un rol vacío o desconocido usa el perfil (la raíz "/" redirige al login)
export function getPostLoginPath(roleTag: string | null | undefined): string {
  return roleTag === ADMINISTRATIVE_ROLE_TAG ? BACKOFFICE_HOME_PATH : DEFAULT_HOME_PATH;
}
