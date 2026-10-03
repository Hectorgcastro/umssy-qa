import { Conversation } from '../types/conversation.types';
import { MOCK_CONVERSATIONS } from '../mocks/mock-conversations';
import { User } from '../types/user.types';
import { MOCK_USERS, CURRENT_USER_ID } from '../mocks/mock-users';

const MIN_SEARCH_CHARS = 2;

export async function getConversations(): Promise<Conversation[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return [...MOCK_CONVERSATIONS].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}


/**
 * Normaliza una cadena para comparacion sin distinguir mayusculas ni tildes.
 * Convierte a minusculas, quita diacriticos (á → a, ñ → n, etc.) y recorta espacios.
 */
function normalizeText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
/**
 * Busca usuarios mock por coincidencia parcial de nombre.
 *
 * Reglas:
 * - Retorna [] si la query tiene menos de 2 caracteres tras normalizar
 * - Excluye al usuario actual (CURRENT_USER_ID) de los resultados
 * - Excluye a usuarios inactivos (isActive === false)
 * - Sin distinguir mayusculas ni tildes
 * - Retorna [] si no hay coincidencias
 * - Trata la entrada como texto plano
 */
export async function searchUsers(rawQuery: string): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const query = normalizeText(rawQuery);

  if (query.length < MIN_SEARCH_CHARS) {
    return [];
  }

  return MOCK_USERS.filter((user) => {
    if (user.id === CURRENT_USER_ID) return false;
    if (!user.isActive) return false;      
    return normalizeText(user.fullName).includes(query);
  });
}
