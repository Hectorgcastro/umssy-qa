import { Message } from '../types/conversation.types';

const now = new Date();
const minutesAgo = (n: number) => new Date(now.getTime() - n * 60_000).toISOString();

/**
 * Historial de mensajes mock por conversacion.
 * conv-4 queda intencionalmente sin mensajes para probar el caso de sala vacia.
 */
export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1-1',
    conversationId: 'conv-1',
    senderId: 'user-101',
    content: 'Hola, pudiste revisar los requerimientos de la vacante de Frontend?',
    isAttachment: false,
    createdAt: minutesAgo(20),
  },
  {
    id: 'msg-1-2',
    conversationId: 'conv-1',
    senderId: 'current-user',
    content: 'Si, ya los revise. Te comento en un momento.',
    isAttachment: false,
    createdAt: minutesAgo(15),
  },
  {
    id: 'msg-2-1',
    conversationId: 'conv-2',
    senderId: 'user-102',
    content: 'Perfecto, coordinamos la llamada para manana a primera hora.',
    isAttachment: false,
    createdAt: minutesAgo(120),
  },
  {
    id: 'msg-3-1',
    conversationId: 'conv-3',
    senderId: 'user-103',
    content: 'Te envie el documento de soporte en formato PDF.',
    isAttachment: true,
    attachmentType: 'file',
    createdAt: minutesAgo(1440),
  },
];