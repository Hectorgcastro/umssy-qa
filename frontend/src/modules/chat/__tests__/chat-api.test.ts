import { describe, it, expect } from 'vitest';
import { getConversations } from '../services/chat-api';

describe('chat-api', () => {
  it('debe retornar las conversaciones ordenadas cronologicamente descendente', async () => {
    const conversations = await getConversations();

    expect(conversations).toBeDefined();
    expect(conversations.length).toBeGreaterThan(0);

    for (let i = 0; i < conversations.length - 1; i++) {
      const dateCurrent = new Date(conversations[i].updatedAt).getTime();
      const dateNext = new Date(conversations[i + 1].updatedAt).getTime();
      expect(dateCurrent).toBeGreaterThanOrEqual(dateNext);
    }
  });
});