import { describe, it, expect } from 'vitest';
import { getConversations, searchUsers } from '../services/chat-api';
import { CURRENT_USER_ID } from '../mocks/mock-users';

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