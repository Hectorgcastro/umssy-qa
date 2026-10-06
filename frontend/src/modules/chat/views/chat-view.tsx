'use client';

import {
  useState,
  useEffect,
  useRef,
} from 'react';
import { useConversations } from '../hooks/use-conversations';
import { ConversationList } from '../components/conversation-list';
import { EmptyChatState } from '../components/empty-chat-state';
import { ContactSearchModal } from '../components/contact-search-modal';
import { ChatRoom } from '../components/chat-room';
import {
  Message,
  Conversation,
} from '../types/conversation.types';
import { User } from '../types/user.types';
import {
  getMessages,
  sendMessage,
} from '../services/chat-api';
import { CURRENT_USER_ID } from '../mocks/mock-users';

function sortMessagesChronologically(
  messages: Message[],
): Message[] {
  return [...messages].sort(
    (a, b) => {
      const timeA =
        new Date(
          a.timestamp ||
            a.createdAt,
        ).getTime();

      const timeB =
        new Date(
          b.timestamp ||
            b.createdAt,
        ).getTime();

      return timeA - timeB;
    },
  );
}

export function ChatView() {
  const [
    isSearchModalOpen,
    setIsSearchModalOpen,
  ] = useState(false);

  const [
    messages,
    setMessages,
  ] =
    useState<Message[]>([]);

  const [
    isLoadingMessages,
    setIsLoadingMessages,
  ] = useState(false);

  const [
    isSending,
    setIsSending,
  ] = useState(false);

  const [
    sendError,
    setSendError,
  ] =
    useState<string | null>(
      null,
    );

  const sendingLockRef =
    useRef(false);

  const {
    conversations,
    selectedConversation,
    hasMore,
    loadMore,
    selectedId,
    activeFilter,
    searchQuery,
    isLoading,
    setActiveFilter,
    setSearchQuery,
    handleSelectConversation,
    clearSelectedConversation,
    startConversationWithContact,
  } = useConversations();

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    let isMounted = true;

    getMessages(selectedId)
      .then((data) => {
        if (isMounted) {
          setMessages(
            sortMessagesChronologically(
              data,
            ),
          );

          setIsLoadingMessages(
            false,
          );
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoadingMessages(
            false,
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedId]);

  const handleBackToList =
    () => {
      setSendError(null);
      clearSelectedConversation();
    };

  const handleSelectChat = (
    conversation: Conversation,
  ) => {
    setSendError(null);
    setIsLoadingMessages(true);
    handleSelectConversation(
      conversation,
    );
  };

  const handleStartNewChat =
    () => {
      if (
        activeFilter !== 'all'
      ) {
        setActiveFilter('all');
      }

      setIsSearchModalOpen(
        true,
      );
    };

  const handleStartChatWithContact =
    async (
      contactUser: User,
    ) => {
      if (
        activeFilter !== 'all'
      ) {
        setActiveFilter('all');
      }

      setSendError(null);
      setIsLoadingMessages(true);

      await startConversationWithContact(
        contactUser,
      );
    };

  const handleSendMessage =
    async (
      content: string,
    ): Promise<boolean> => {
      if (
        !selectedId ||
        isSending ||
        sendingLockRef.current
      ) {
        return false;
      }

      /*
       * Comprobacion inmediata de
       * conectividad antes de intentar
       * registrar el mensaje temporal.
       */
      if (
        typeof navigator !==
          'undefined' &&
        navigator.onLine === false
      ) {
        setSendError(
          'Sin conexión a internet. Verifica tu conexión e intenta nuevamente.',
        );

        return false;
      }

      sendingLockRef.current =
        true;

      setIsSending(true);
      setSendError(null);

      const nowIso =
        new Date().toISOString();

      const temporaryMessage: Message =
        {
          id: `temp-${Date.now()}`,
          conversationId:
            selectedId,
          senderId:
            CURRENT_USER_ID,
          content,
          timestamp: nowIso,
          createdAt: nowIso,
          status: 'sending',
          isAttachment: false,
        };

      setMessages(
        (
          previousMessages,
        ) =>
          sortMessagesChronologically(
            [
              ...previousMessages,
              temporaryMessage,
            ],
          ),
      );

      try {
        const response =
          await sendMessage({
            conversationId:
              selectedId,
            content,
            senderId:
              CURRENT_USER_ID,
          });

        setMessages(
          (
            previousMessages,
          ) => {
            const updatedMessages =
              previousMessages.map(
                (message) =>
                  message.id ===
                  temporaryMessage.id
                    ? response.data
                    : message,
              );

            return sortMessagesChronologically(
              updatedMessages,
            );
          },
        );

        return true;
      } catch (error) {
        /*
         * Si falla el envio se elimina
         * el mensaje temporal.
         *
         * El textarea NO se limpia,
         * permitiendo reintentar.
         */
        setMessages(
          (
            previousMessages,
          ) =>
            previousMessages.filter(
              (message) =>
                message.id !==
                temporaryMessage.id,
            ),
        );

        const errorMessage =
          error instanceof Error
            ? error.message
            : '';

        if (
          errorMessage
            .toLowerCase()
            .includes(
              'conexion',
            ) ||
          errorMessage
            .toLowerCase()
            .includes('red')
        ) {
          setSendError(
            'Sin conexión a internet. Verifica tu conexión e intenta nuevamente.',
          );
        } else {
          setSendError(
            'No se pudo enviar el mensaje. Intenta nuevamente.',
          );
        }

        return false;
      } finally {
        sendingLockRef.current =
          false;

        setIsSending(false);
      }
    };

  return (
    <div className="flex h-screen h-[100dvh] w-full max-w-full bg-slate-50 overflow-hidden font-sans">
      <aside
        className={`w-full md:w-80 lg:w-96 h-full shrink-0 overflow-hidden ${
          selectedId
            ? 'hidden md:block'
            : 'block'
        }`}
      >
        <ConversationList
          conversations={
            conversations
          }
          selectedId={
            selectedId
          }
          isLoading={isLoading}
          hasMore={hasMore}
          activeFilter={
            activeFilter
          }
          searchQuery={
            searchQuery
          }
          onSelectConversation={
            handleSelectChat
          }
          onFilterChange={
            setActiveFilter
          }
          onSearchChange={
            setSearchQuery
          }
          onLoadMore={loadMore}
          onStartNewChat={
            handleStartNewChat
          }
        />
      </aside>

      <main
        className={`flex-1 h-full min-w-0 min-h-0 bg-white flex flex-col overflow-hidden ${
          !selectedId
            ? 'hidden md:flex'
            : 'flex'
        }`}
      >
        {selectedConversation ? (
          <ChatRoom
            conversation={
              selectedConversation
            }
            messages={
              messages
            }
            currentUserId={
              CURRENT_USER_ID
            }
            onBack={
              handleBackToList
            }
            onSendMessage={
              handleSendMessage
            }
            isLoadingMessages={
              isLoadingMessages
            }
            isSending={
              isSending
            }
            sendError={
              sendError
            }
            onClearSendError={() =>
              setSendError(null)
            }
          />
        ) : (
          <EmptyChatState
            description="Selecciona una conversacion existente en el panel izquierdo o inicia una nueva para comenzar a comunicarte."
            actionLabel="Iniciar una nueva conversacion"
            onAction={
              handleStartNewChat
            }
          />
        )}
      </main>

      <ContactSearchModal
        isOpen={
          isSearchModalOpen
        }
        onClose={() =>
          setIsSearchModalOpen(
            false,
          )
        }
        onSelectContact={
          handleStartChatWithContact
        }
      />
    </div>
  );
}