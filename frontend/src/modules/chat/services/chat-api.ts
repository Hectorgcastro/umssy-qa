import {
  Conversation,
  Message,
  SendMessagePayload,
  SendMessageOptions,
  SendMessageResponse,
} from '../types/conversation.types';
import { MOCK_CONVERSATIONS } from '../mocks/mock-conversations';
import { User } from '../types/user.types';
import { MOCK_USERS, CURRENT_USER_ID, MOCK_USER_BY_ID } from '../mocks/mock-users';
import { getMessagesByConversation, saveStoredMessage } from './message-storage';

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

  return getMessagesByConversation(conversationId);
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

/**
 * Simula el envio asincrono de un mensaje (POST /api/messages)
 * con latencia artificial entre 300ms y 600ms (< 2 segundos),
 * soporte para caidas de red y simulacion de modo offline.
 */
export async function sendMessage(
  payload: SendMessagePayload,
  options?: SendMessageOptions
): Promise<SendMessageResponse> {
  const isBrowserOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  if (options?.forceOffline || isBrowserOffline) {
    throw new Error('Error de red: Sin conexion a internet');
  }

  if (options?.forceError) {
    throw new Error('Error del servidor: No se pudo procesar el envio del mensaje');
  }

  if (!payload.conversationId) {
    throw new Error('El identificador de conversacion es requerido');
  }

  const trimmedContent = payload.content.trim();
  if (trimmedContent.length === 0) {
    throw new Error('El contenido del mensaje no puede estar vacio');
  }

  const minLatency = 300;
  const maxLatency = 600;
  const latency =
    options?.latencyMs ??
    Math.floor(Math.random() * (maxLatency - minLatency + 1)) + minLatency;

  await new Promise((resolve) => setTimeout(resolve, latency));

  const nowIso = new Date().toISOString();
  const createdMessage: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    conversationId: payload.conversationId,
    senderId: payload.senderId || CURRENT_USER_ID,
    content: payload.content,
    timestamp: nowIso,
    status: 'sent',
    createdAt: nowIso,
    isAttachment: false,
  };

  saveStoredMessage(createdMessage);

  return {
    statusCode: 201,
    ok: true,
    detail: 'Mensaje enviado exitosamente',
    data: createdMessage,
  };
}