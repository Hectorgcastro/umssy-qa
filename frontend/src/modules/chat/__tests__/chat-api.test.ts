import { describe, it, expect } from 'vitest';
import {
  getConversations, searchUsers, getMessages, getOrCreateConversation} from '../services/chat-api';
import { CURRENT_USER_ID } from '../mocks/mock-users';
import { MOCK_CONVERSATIONS } from '../mocks/mock-conversations';

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

describe('chat-api — searchUsers', () => {
  it('debe retornar lista vacia si la query tiene menos de 2 caracteres', async () => {
    expect(await searchUsers('')).toEqual([]);
    expect(await searchUsers('a')).toEqual([]);
    expect(await searchUsers(' ')).toEqual([]);
    expect(await searchUsers('  a  ')).toEqual([]);
  });

  it('debe encontrar usuarios por coincidencia parcial de nombre', async () => {
    const results = await searchUsers('maria');
    expect(results.length).toBeGreaterThan(0);
    results.forEach((user) => {
      expect(user.fullName.toLowerCase()).toContain('maria');
    });
  });

  it('debe ignorar mayusculas y tildes', async () => {
    const lower = await searchUsers('maria');
    const upper = await searchUsers('MARIA');
    const accented = await searchUsers('maría');

    expect(lower.length).toBe(upper.length);
    expect(lower.length).toBe(accented.length);

    const lowerIds = lower.map((u) => u.id).sort();
    const upperIds = upper.map((u) => u.id).sort();
    const accentedIds = accented.map((u) => u.id).sort();

    expect(lowerIds).toEqual(upperIds);
    expect(lowerIds).toEqual(accentedIds);
  });

  it('no debe incluir al currentUser en los resultados', async () => {
    const results = await searchUsers('yo');
    expect(results.find((u) => u.id === CURRENT_USER_ID)).toBeUndefined();
  });

  it('no debe incluir usuarios inactivos', async () => {
    const results = await searchUsers('ar');
    expect(results.length).toBeGreaterThan(0);
    results.forEach((user) => {
      expect(user.isActive).toBe(true);
    });
  });

  it('debe retornar lista vacia si no hay coincidencias', async () => {
    const results = await searchUsers('zzzzzzzz');
    expect(results).toEqual([]);
  });

  it('debe tratar caracteres especiales como texto plano', async () => {
    await expect(searchUsers("'")).resolves.toEqual([]);
    await expect(searchUsers('"')).resolves.toEqual([]);
    await expect(searchUsers(';')).resolves.toEqual([]);
    await expect(searchUsers('%')).resolves.toEqual([]);
    await expect(searchUsers("' OR 1=1 --")).resolves.toEqual([]);
    await expect(searchUsers('<script>')).resolves.toEqual([]);
  });

  it('no debe exponer campos sensibles como email o telefono', async () => {
    const results = await searchUsers('ar');
    expect(results.length).toBeGreaterThan(0);

    results.forEach((user) => {
      const keys = Object.keys(user);
      expect(keys).not.toContain('email');
      expect(keys).not.toContain('phone');
      expect(keys).not.toContain('phoneNumber');
    });
  });

  it('debe filtrar 100+ usuarios en menos de 50 ms de computo', async () => {
    const start = performance.now();
    await searchUsers('ar');
    const elapsed = performance.now() - start;
    const computeTime = elapsed - 200;
    expect(computeTime).toBeLessThan(50);
  });
});

describe('chat-api — getMessages', () => {
  it('debe retornar los mensajes de una conversacion ordenados del mas antiguo al mas reciente', async () => {
    const messages = await getMessages('conv-1');
    expect(messages.length).toBeGreaterThan(0);

    for (let i = 0; i < messages.length - 1; i++) {
      const current = new Date(messages[i].createdAt).getTime();
      const next = new Date(messages[i + 1].createdAt).getTime();
      expect(current).toBeLessThanOrEqual(next);
    }
  });

  it('debe retornar lista vacia si la conversacion no tiene mensajes', async () => {
    const messages = await getMessages('conv-4');
    expect(messages).toEqual([]);
  });

  it('debe retornar lista vacia si la conversacion no existe', async () => {
    const messages = await getMessages('conv-inexistente');
    expect(messages).toEqual([]);
  });
});

describe('chat-api — getOrCreateConversation', () => {
  it('debe retornar la conversacion existente si ya hay una con ese contacto', async () => {
    const existing = MOCK_CONVERSATIONS[0];
    const result = await getOrCreateConversation(existing.contact.id);

    expect(result.id).toBe(existing.id);
    expect(result.contact.id).toBe(existing.contact.id);
  });

  it('debe crear una conversacion nueva si no existe con ese contacto', async () => {
    // user-105 (Ana Rojas) has no conversation in mock-conversations.ts
    const result = await getOrCreateConversation('user-105');

    expect(result.id).toBeDefined();
    expect(result.contact.id).toBe('user-105');
    expect(result.contact.fullName).toBeTruthy();
    expect(result.lastMessage).toBeNull();
    expect(result.unreadCount).toBe(0);
    expect(result.contact.isOnline).toBe(false);
  });

  it('debe lanzar error si el contacto no existe', async () => {
    await expect(getOrCreateConversation('user-inexistente'))
      .rejects.toThrow('UserNotFoundException');
  });

  it('no debe mutar MOCK_CONVERSATIONS al crear una conversacion nueva', async () => {
    const before = MOCK_CONVERSATIONS.length;
    await getOrCreateConversation('user-106');
    expect(MOCK_CONVERSATIONS.length).toBe(before);
  });
});