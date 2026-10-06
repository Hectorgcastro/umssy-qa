import {
  describe,
  it,
  expect,
  vi,
  afterEach,
} from 'vitest';
import {
  render,
  screen,
  cleanup,
} from '@testing-library/react';
import { ChatRoom } from '../components/chat-room';
import {
  Conversation,
  Message,
} from '../types/conversation.types';
import { sanitizeMessageContent } from '../utils/message-sanitizer';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const conversation: Conversation =
  {
    id: 'conv-security',
    contact: {
      id: 'user-contact',
      fullName: 'Usuario Prueba',
      avatarUrl: null,
      isOnline: true,
    },
    lastMessage: null,
    unreadCount: 0,
    updatedAt:
      new Date().toISOString(),
  };

describe(
  'HU-03 Tarea 7 - Seguridad XSS',
  () => {
    it(
      'debe conservar etiquetas HTML como texto',
      () => {
        const content =
          '<script>alert("XSS")</script>';

        expect(
          sanitizeMessageContent(
            content,
          ),
        ).toBe(content);
      },
    );

    it(
      'debe renderizar script como texto sin crear un elemento script',
      () => {
        const now =
          new Date().toISOString();

        const message: Message =
          {
            id: 'msg-xss',
            conversationId:
              conversation.id,
            senderId:
              'current-user',
            content:
              '<script>alert("XSS")</script>',
            timestamp: now,
            createdAt: now,
            status: 'sent',
          };

        const { container } =
          render(
            <ChatRoom
              conversation={
                conversation
              }
              messages={[
                message,
              ]}
              currentUserId="current-user"
              onBack={vi.fn()}
              onSendMessage={vi
                .fn()
                .mockResolvedValue(
                  true,
                )}
            />,
          );

        expect(
          screen.getByText(
            '<script>alert("XSS")</script>',
          ),
        ).toBeDefined();

        expect(
          container.querySelector(
            'script',
          ),
        ).toBeNull();
      },
    );

    it(
      'debe mostrar etiquetas HTML normales como texto y no como nodos HTML',
      () => {
        const now =
          new Date().toISOString();

        const message: Message =
          {
            id: 'msg-html',
            conversationId:
              conversation.id,
            senderId:
              'current-user',
            content:
              '<img src=x onerror=alert(1)>',
            timestamp: now,
            createdAt: now,
            status: 'sent',
          };

        const { container } =
          render(
            <ChatRoom
              conversation={
                conversation
              }
              messages={[
                message,
              ]}
              currentUserId="current-user"
              onBack={vi.fn()}
              onSendMessage={vi
                .fn()
                .mockResolvedValue(
                  true,
                )}
            />,
          );

        expect(
          screen.getByText(
            '<img src=x onerror=alert(1)>',
          ),
        ).toBeDefined();

        expect(
          container.querySelector(
            'img[src="x"]',
          ),
        ).toBeNull();
      },
    );
  },
);