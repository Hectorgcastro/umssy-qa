import { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';
import { ROLES_KEY } from '../../../common/constants/roles.constants.js';
import { AvailabilityController } from '../controllers/availability.controller.js';

const USER = { id: 'mentor-1', email: 'mentor.a@umssy.test', roles: ['mentor'] };
const QUERY = { from: '2026-10-05T04:00:00.000Z', to: '2026-10-12T03:59:59.999Z' };

describe('AvailabilityController', () => {
  it('delega al servicio con el id del mentor en sesión y el rango recibido', async () => {
    const blocks = [{ id: 'block-1', state: 'free' }];
    const availabilityService = { findMyBlocks: vi.fn().mockResolvedValue(blocks) };
    const controller = new AvailabilityController(availabilityService as any);

    const result = await controller.findMyBlocks(USER, QUERY);

    expect(availabilityService.findMyBlocks).toHaveBeenCalledWith('mentor-1', QUERY);
    expect(result).toBe(blocks);
  });

  it('exige el rol mentor en findMyBlocks', () => {
    const handler = Object.getOwnPropertyDescriptor(AvailabilityController.prototype, 'findMyBlocks')?.value;
    const roles = new Reflector().get<string[]>(ROLES_KEY, handler);
    expect(roles).toEqual(['mentor']);
  });

  it('delega la eliminación con el mentor en sesión y el id recibido', async () => {
    const availabilityService = { remove: vi.fn().mockResolvedValue({ id: 'block-1' }) };
    const controller = new AvailabilityController(availabilityService as any);

    const result = await controller.remove(USER, 'block-1');

    expect(availabilityService.remove).toHaveBeenCalledWith('mentor-1', 'block-1');
    expect(result).toEqual({ id: 'block-1' });
  });

  it('exige el rol mentor en remove', () => {
    const handler = Object.getOwnPropertyDescriptor(AvailabilityController.prototype, 'remove')?.value;
    const roles = new Reflector().get<string[]>(ROLES_KEY, handler);
    expect(roles).toEqual(['mentor']);
  });
});
