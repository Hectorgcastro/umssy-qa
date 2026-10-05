'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getMessages } from '../services/chat-api';
import { Message } from '../types/conversation.types';

const PAGE_SIZE = 20;

export interface MessagesPage {
  messages: Message[];
  hasMore: boolean;
  nextPage: number | undefined;
}

export const messagesQueryKey = (conversationId: string | null) => [
  'messages',
  conversationId,
];

export function useMessages(conversationId: string | null) {
  const query = useInfiniteQuery({
    queryKey: messagesQueryKey(conversationId),

    queryFn: async ({ pageParam = 0 }): Promise<MessagesPage> => {
      if (!conversationId) {
        return {
          messages: [],
          hasMore: false,
          nextPage: undefined,
        };
      }

      const allMessages = await getMessages(conversationId);

      // Aseguramos orden cronológico:
      // mensaje más antiguo → mensaje más reciente
      const chronologicalMessages = [...allMessages].sort(
        (a, b) =>
          new Date(a.timestamp || a.createdAt || '').getTime() -
          new Date(b.timestamp || b.createdAt || '').getTime()
      );

      const end = chronologicalMessages.length - pageParam * PAGE_SIZE;
      const start = Math.max(0, end - PAGE_SIZE);

      const pageMessages = chronologicalMessages.slice(start, end);

      return {
        messages: pageMessages,
        hasMore: start > 0,
        nextPage: start > 0 ? pageParam + 1 : undefined,
      };
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage) => lastPage.nextPage,

    enabled: Boolean(conversationId),
  });

  const messages = query.data
    ? [...query.data.pages]
        .reverse()
        .flatMap((page) => page.messages)
    : [];

  return {
    ...query,
    data: messages,
    hasMoreMessages: Boolean(
      query.data?.pages[query.data.pages.length - 1]?.hasMore
    ),
    loadMoreMessages: query.fetchNextPage,
    isLoadingMoreMessages: query.isFetchingNextPage,
  };
}
