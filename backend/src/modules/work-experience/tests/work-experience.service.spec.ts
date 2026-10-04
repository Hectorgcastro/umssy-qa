import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkExperienceNotFoundException } from '../exceptions/work-experience-not-found.exception.js';
import { WorkExperienceMapper } from '../mappers/work-experience.mapper.js';
import type { WorkExperienceRepository } from '../repositories/work-experience.repository.js';
import { WorkExperienceService } from '../services/work-experience.service.js';
import type { WorkExperienceRecord } from '../types/work-experience-record.type.js';

const userId = '11111111-1111-4111-8111-111111111111';
const workExperienceId = '33333333-3333-4333-8333-333333333333';
const record: WorkExperienceRecord = {
  id: workExperienceId,
  userId,
  position: 'Junior web developer',
  startDate: new Date('2025-03-01T00:00:00.000Z'),
  endDate: null,
  isCurrent: true,
  description: null,
  createdAt: new Date('2025-03-02T10:00:00.000Z'),
  updatedAt: new Date('2025-03-02T10:00:00.000Z'),
  company: {
    id: '44444444-4444-4444-8444-444444444444',
    title: 'Synapse Labs',
  },
};

describe('WorkExperienceService', () => {
  const repository = {
    findManyByUserId: vi.fn(),
    findByIdAndUserId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const mapper = new WorkExperienceMapper();
  let service: WorkExperienceService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new WorkExperienceService(
      repository as unknown as WorkExperienceRepository,
      mapper,
    );
  });

  it('lists the records of the user as responses', async () => {
    repository.findManyByUserId.mockResolvedValue([record]);

    await expect(service.findAll(userId)).resolves.toEqual([
      mapper.toResponse(record),
    ]);
    expect(repository.findManyByUserId).toHaveBeenCalledWith(userId);
  });

  it('creates a record and fills the optional fields with null', async () => {
    repository.create.mockResolvedValue(record);

    await expect(
      service.create(userId, {
        companyName: 'Synapse Labs',
        position: 'Junior web developer',
        startDate: record.startDate,
        isCurrent: true,
      }),
    ).resolves.toEqual(mapper.toResponse(record));
    expect(repository.create).toHaveBeenCalledWith(userId, {
      companyName: 'Synapse Labs',
      position: 'Junior web developer',
      startDate: record.startDate,
      endDate: null,
      isCurrent: true,
      description: null,
    });
  });

  it('updates a record of the user', async () => {
    repository.update.mockResolvedValue({ ...record, position: 'Lead' });

    const response = await service.update(userId, workExperienceId, {
      position: 'Lead',
    });

    expect(response.position).toBe('Lead');
    expect(repository.update).toHaveBeenCalledWith(workExperienceId, userId, {
      position: 'Lead',
    });
  });

  it('fails with not found when the record to update is not from the user', async () => {
    repository.update.mockResolvedValue(null);

    await expect(
      service.update(userId, workExperienceId, { position: 'Lead' }),
    ).rejects.toBeInstanceOf(WorkExperienceNotFoundException);
  });

  it('deletes a record of the user', async () => {
    repository.delete.mockResolvedValue(true);

    await expect(
      service.remove(userId, workExperienceId),
    ).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(workExperienceId, userId);
  });

  it('fails with not found when the record to delete is not from the user', async () => {
    repository.delete.mockResolvedValue(false);

    await expect(
      service.remove(userId, workExperienceId),
    ).rejects.toBeInstanceOf(WorkExperienceNotFoundException);
  });
});