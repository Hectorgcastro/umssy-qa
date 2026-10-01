import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useConversations } from '../hooks/use-conversations';
import * as chatApi from '../services/chat-api';

const mockList = [
  {
    id: 'c1',
    contact: { id: 'u1', fullName: 'Ana Gomez', avatarUrl: null, isOnline: true },
    lastMessage: { id: 'm1', senderId: 'u1', content: 'Msg 1', isAttachment: false, createdAt: '2026-03-01T10:00:00Z' },
    unreadCount: 2,
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'c2',
    contact: { id: 'u2', fullName: 'Beto Lopez', avatarUrl: null, isOnline: false },
    lastMessage: { id: 'm2', senderId: 'u2', content: 'Msg 2', isAttachment: false, createdAt: '2026-03-02T10:00:00Z' },
    unreadCount: 0,
    updatedAt: '2026-03-02T10:00:00Z',
  },
];

describe('useConversations Hook', () => {
  it('debe cargar conversaciones, filtrar por texto y por no leidos', async () => {
    vi.spyOn(chatApi, 'getConversations').mockResolvedValue(mockList);

    const { result } = renderHook(() => useConversations());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversations.length).toBe(2);

    act(() => {
      result.current.setActiveFilter('unread');
    });
    expect(result.current.conversations.length).toBe(1);
    expect(result.current.conversations[0].contact.fullName).toBe('Ana Gomez');

    act(() => {
      result.current.setActiveFilter('all');
      result.current.setSearchQuery('beto');
    });
    expect(result.current.conversations.length).toBe(1);
    expect(result.current.conversations[0].contact.fullName).toBe('Beto Lopez');
  });

  it('debe resetear los no leidos al seleccionar una conversacion y permitir limpiar seleccion', async () => {
    vi.spyOn(chatApi, 'getConversations').mockResolvedValue(mockList);

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleSelectConversation(mockList[0]);
    });

    expect(result.current.selectedId).toBe('c1');
    const selectedItem = result.current.conversations.find((c) => c.id === 'c1');
    expect(selectedItem?.unreadCount).toBe(0);

    act(() => {
      result.current.clearSelectedConversation();
    });
    expect(result.current.selectedId).toBeNull();
  });

  it('debe simular mensajes entrantes reordenando al inicio', async () => {
    vi.spyOn(chatApi, 'getConversations').mockResolvedValue(mockList);

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.simulateIncomingMessage('c1', 'Nuevo mensaje');
    });

    expect(result.current.conversations[0].id).toBe('c1');
    expect(result.current.conversations[0].lastMessage?.content).toBe('Nuevo mensaje');
  });

  it('debe manejar error si falla la peticion al servicio', async () => {
    vi.spyOn(chatApi, 'getConversations').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
  });

  it('debe permitir paginacion y cargar mas elementos', async () => {
    const manyItems = Array.from({ length: 15 }, (_, i) => ({
      id: `item-${i}`,
      contact: { id: `u-${i}`, fullName: `Usuario ${i}`, avatarUrl: null, isOnline: false },
      lastMessage: null,
      unreadCount: 0,
      updatedAt: new Date(Date.now() - i * 1000).toISOString(),
    }));

    vi.spyOn(chatApi, 'getConversations').mockResolvedValue(manyItems);

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.conversations.length).toBe(10);
    expect(result.current.hasMore).toBe(true);

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.conversations.length).toBe(15);
    expect(result.current.hasMore).toBe(false);
  });
});