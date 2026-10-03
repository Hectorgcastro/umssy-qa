import { Conversation, Message } from '../types/conversation.types';
import { MOCK_CONVERSATIONS } from '../mocks/mock-conversations';
import { User } from '../types/user.types';
import { MOCK_USERS, CURRENT_USER_ID, MOCK_USER_BY_ID } from '../mocks/mock-users';
import { MOCK_MESSAGES } from '../mocks/mock-messages';

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

/**
 * Retorna el historial de mensajes de una conversacion, ordenado del mas
 * antiguo al mas reciente. Lista vacia si no hay mensajes.
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return MOCK_MESSAGES
    .filter((message) => message.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Retorna la conversacion existente con el contacto dado, o crea una nueva
 * vacia si no existe, no duplica
 */
export async function getOrCreateConversation(contactId: string): Promise<Conversation> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const existing = MOCK_CONVERSATIONS.find(
    (conversation) => conversation.contact.id === contactId
  );
  if (existing) return existing;

  const contact = MOCK_USER_BY_ID[contactId];
  if (!contact) {
    throw new Error('UserNotFoundException');
  }

  return {
    id: `conv-${contactId}-${Date.now()}`,
    contact: {
      id: contact.id,
      fullName: contact.fullName,
      avatarUrl: contact.avatarUrl,
      isOnline: false,
    },
    lastMessage: null,
    unreadCount: 0,
    updatedAt: new Date().toISOString(),
  };
}