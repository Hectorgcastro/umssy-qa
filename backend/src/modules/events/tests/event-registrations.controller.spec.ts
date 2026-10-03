import { describe, expect, it, vi } from 'vitest';
import { EventRegistrationsController } from '../controllers/event-registrations.controller.js';
import type { EventRegistrationsService } from '../services/event-registrations.service.js';

describe('EventRegistrationsController', () => {
  it('delega en el service con el userId recibido', async () => {
    const expected = [{ id: 'reg-1' }];
    const findMine = vi.fn().mockResolvedValue(expected);
    const controller = new EventRegistrationsController({
      findMine,
    } as unknown as EventRegistrationsService);

    const result = await controller.findMine('user-1');

    expect(findMine).toHaveBeenCalledWith('user-1');
    expect(result).toBe(expected);
  });
});