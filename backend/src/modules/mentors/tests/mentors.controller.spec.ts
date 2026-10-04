import { describe, expect, it, vi } from 'vitest';
import { MentorsController } from '../controllers/mentors.controller.js';
import type { MentorsService } from '../services/mentors.service.js';

describe('MentorsController', () => {
  it('activa mentor delegando al servicio', async () => {
    const activate = vi.fn().mockResolvedValue({
      id: 'mentor-1',
    });

    const service = {
      activate,
    } as unknown as MentorsService;

    const controller = new MentorsController(service);

    const user = {
      id: 'user-1',
    };

    const body = {
      technicalAreaIds: [
        '0424f370-00f0-43cf-9b8a-997af81840b9',
      ],
      orientationTypeIds: [
        '0fa5e6de-63a4-430e-87fb-22f5eb700ecd',
      ],
    };

    const result = await controller.activate(user, body);

    expect(activate).toHaveBeenCalledTimes(1);
    expect(activate).toHaveBeenCalledWith(
      'user-1',
      body,
    );

    expect(result).toEqual({
      id: 'mentor-1',
    });
  });

  it('rechaza datos inválidos del body', () => {
    const service = {
      activate: vi.fn(),
    } as unknown as MentorsService;

    const controller = new MentorsController(service);

    const user = {
      id: 'user-1',
    };

    const body = {
      technicalAreaIds: [],
      orientationTypeIds: [],
    };

    expect(() =>
      controller.activate(user, body),
    ).toThrow();
  });
});