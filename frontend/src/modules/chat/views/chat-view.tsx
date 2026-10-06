'use client';

import { useState, useEffect, useRef } from 'react';
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

export function ChatView() {
  const [isSearchModalOpen, setIsSearchModalOpen] =
    useState(false);

  const [messages, setMessages] = useState<Message[]>(
    [],
  );

  const [isLoadingMessages, setIsLoadingMessages] =
    useState(false);

  const [isSending, setIsSending] = useState(false);

  /**
   * Bloqueo sincrono para evitar envios duplicados.
   *
   * A diferencia de useState, el valor del ref cambia
   * inmediatamente y evita que dos acciones rapidas
   * entren al mismo tiempo.
   */
  const sendingLockRef = useRef(false);

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
    if (!selectedId) return;

    let isMounted = true;

    getMessages(selectedId)
      .then((data) => {
        if (isMounted) {
          setMessages(data);
          setIsLoadingMessages(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoadingMessages(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedId]);

  const handleBackToList = () => {
    clearSelectedConversation();
  };

  const handleSelectChat = (
    conversation: Conversation,
  ) => {
    setIsLoadingMessages(true);
    handleSelectConversation(conversation);
  };

  const handleStartNewChat = () => {
    if (activeFilter !== 'all') {
      setActiveFilter('all');
    }

    setIsSearchModalOpen(true);
  };

  const handleStartChatWithContact = async (
    contactUser: User,
  ) => {
    if (activeFilter !== 'all') {
      setActiveFilter('all');
    }

    setIsLoadingMessages(true);

    await startConversationWithContact(
      contactUser,
    );
  };

  const handleSendMessage = async (
    content: string,
  ) => {
    /**
     * Proteccion contra:
     * - doble clic rapido
     * - varios Enter consecutivos
     * - Enter + clic simultaneo
     */
    if (
      !selectedId ||
      isSending ||
      sendingLockRef.current
    ) {
      return;
    }

    // El bloqueo ocurre inmediatamente.
    sendingLockRef.current = true;
    setIsSending(true);

    try {
      const response = await sendMessage({
        conversationId: selectedId,
        content,
        senderId: CURRENT_USER_ID,
      });

      setMessages((prev) => [
        ...prev,
        response.data,
      ]);
    } catch {
      // El usuario puede intentar nuevamente
      // cuando termine la solicitud.
    } finally {
      sendingLockRef.current = false;
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
          conversations={conversations}
          selectedId={selectedId}
          isLoading={isLoading}
          hasMore={hasMore}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onSelectConversation={
            handleSelectChat
          }
          onFilterChange={setActiveFilter}
          onSearchChange={setSearchQuery}
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
            messages={messages}
            currentUserId={CURRENT_USER_ID}
            onBack={handleBackToList}
            onSendMessage={
              handleSendMessage
            }
            isLoadingMessages={
              isLoadingMessages
            }
            isSending={isSending}
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
        isOpen={isSearchModalOpen}
        onClose={() =>
          setIsSearchModalOpen(false)
        }
        onSelectContact={
          handleStartChatWithContact
        }
      />
    </div>
  );
}