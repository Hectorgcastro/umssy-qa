import { describe, expect, it, vi } from 'vitest';
import type { MentorsRepository } from '../repositories/mentors.repository.js';
import { MentorsService } from '../services/mentors.service.js';
import {
  AlreadyMentorException,
  InvalidOrientationTypesException,
  InvalidTechnicalAreasException,
  MentorNotFoundException,
  MentorRoleNotFoundException,
} from '../exceptions/index.js';

describe('MentorsService', () => {
  const userId = 'user-1';
  const roleId = 'mentor-role-id';
  const data = {
    technicalAreaIds: ['0424f370-00f0-43cf-9b8a-997af81840b9'],
    orientationTypeIds: ['0fa5e6de-63a4-430e-87fb-22f5eb700ecd'],
  };

  it('transforma mentores activos al contrato del directorio', async () => {
    const findActiveMentors = vi.fn().mockResolvedValue([
      {
        id: 'user-1',
        firstName: 'Ana',
        lastName: 'Rojas',
        headline: 'Arquitecta de Software',
        mentorTechnicalAreas: [
          {
            technicalArea: {
              name: 'Backend',
            },
          },
          {
            technicalArea: {
              name: 'Cloud',
            },
          },
        ],
      },
    ]);
    const repository = {
      findActiveMentors,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    const result = await service.findAll();

    expect(findActiveMentors).toHaveBeenCalledTimes(1);
    expect(findActiveMentors).toHaveBeenCalledWith(expect.any(Date));
    expect(result).toEqual([
      {
        id: 'user-1',
        fullName: 'Ana Rojas',
        headline: 'Arquitecta de Software',
        technicalAreas: ['Backend', 'Cloud'],
      },
    ]);
  });

  it('conserva headline como null cuando no esta registrado', async () => {
    const findActiveMentors = vi.fn().mockResolvedValue([
      {
        id: 'user-1',
        firstName: 'Ana',
        lastName: 'Rojas',
        headline: null,
        mentorTechnicalAreas: [],
      },
    ]);
    const repository = {
      findActiveMentors,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    const result = await service.findAll();

    expect(result).toEqual([
      {
        id: 'user-1',
        fullName: 'Ana Rojas',
        headline: null,
        technicalAreas: [],
      },
    ]);
  });

  it('devuelve una lista vacia de areas cuando el mentor no tiene areas tecnicas', async () => {
    const findActiveMentors = vi.fn().mockResolvedValue([
      {
        id: 'user-1',
        firstName: 'Ana',
        lastName: 'Rojas',
        headline: 'Arquitecta de Software',
        mentorTechnicalAreas: [],
      },
    ]);
    const repository = {
      findActiveMentors,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    const result = await service.findAll();

    expect(result[0]?.technicalAreas).toEqual([]);
  });

  it('devuelve una lista vacia cuando no existen mentores activos', async () => {
    const findActiveMentors = vi.fn().mockResolvedValue([]);
    const repository = {
      findActiveMentors,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    const result = await service.findAll();

    expect(result).toEqual([]);
  });

  it('transforma el perfil publico completo de un mentor activo', async () => {
    const startDate = new Date('2020-01-01T00:00:00.000Z');
    const issueDate = new Date('2025-06-15T00:00:00.000Z');
    const findActiveMentorById = vi.fn().mockResolvedValue({
      id: userId,
      firstName: 'Ana',
      lastName: 'Rojas',
      headline: 'Arquitecta de Software',
      aboutMe: 'Mentora de ingeniería de software.',
      photoUrl: new TextEncoder().encode('https://cdn.test/ana.jpg'),
      city: { id: 'city-1', title: 'Cochabamba' },
      educations: [
        {
          id: 'education-1',
          institution: 'UMSS',
          degree: 'Ingeniería de Sistemas',
          startDate,
          endDate: null,
          description: null,
        },
      ],
      workExperiences: [
        {
          id: 'work-1',
          position: 'Tech Lead',
          startDate,
          endDate: null,
          isCurrent: true,
          description: 'Liderazgo técnico',
          company: { id: 'company-1', title: 'Acme' },
        },
      ],
      userSkills: [
        {
          skill: { id: 'skill-1', name: 'TypeScript', isCustom: false },
        },
      ],
      certifications: [
        {
          id: 'certification-1',
          name: 'Cloud Architect',
          issuingOrganization: 'Cloud Org',
          issueDate,
          documentUrl: new TextEncoder().encode('https://cdn.test/cert.pdf'),
        },
      ],
      mentorTechnicalAreas: [
        {
          technicalArea: {
            id: 'area-1',
            name: 'Arquitectura',
            description: 'Diseño de software',
          },
        },
      ],
      mentorOrientationTypes: [
        {
          orientationType: {
            id: 'orientation-1',
            name: 'Orientación técnica',
            description: 'Revisión de decisiones técnicas',
          },
        },
      ],
    });
    const repository = {
      findActiveMentorById,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    const result = await service.findOne(userId);

    expect(findActiveMentorById).toHaveBeenCalledWith(userId, expect.any(Date));
    expect(result).toEqual({
      id: userId,
      fullName: 'Ana Rojas',
      headline: 'Arquitecta de Software',
      aboutMe: 'Mentora de ingeniería de software.',
      photoUrl: 'https://cdn.test/ana.jpg',
      city: { id: 'city-1', title: 'Cochabamba' },
      educations: [
        {
          id: 'education-1',
          institution: 'UMSS',
          degree: 'Ingeniería de Sistemas',
          startDate,
          endDate: null,
          description: null,
        },
      ],
      workExperiences: [
        {
          id: 'work-1',
          position: 'Tech Lead',
          startDate,
          endDate: null,
          isCurrent: true,
          description: 'Liderazgo técnico',
          company: { id: 'company-1', title: 'Acme' },
        },
      ],
      skills: [{ id: 'skill-1', name: 'TypeScript', isCustom: false }],
      certifications: [
        {
          id: 'certification-1',
          name: 'Cloud Architect',
          issuingOrganization: 'Cloud Org',
          issueDate,
          documentUrl: 'https://cdn.test/cert.pdf',
        },
      ],
      technicalAreas: [
        {
          id: 'area-1',
          name: 'Arquitectura',
          description: 'Diseño de software',
        },
      ],
      orientationTypes: [
        {
          id: 'orientation-1',
          name: 'Orientación técnica',
          description: 'Revisión de decisiones técnicas',
        },
      ],
    });
  });

  it('responde 404 cuando el usuario no es un mentor activo', async () => {
    const findActiveMentorById = vi.fn().mockResolvedValue(null);
    const repository = {
      findActiveMentorById,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    const result = service.findOne(userId);

    await expect(result).rejects.toBeInstanceOf(MentorNotFoundException);
    await expect(result).rejects.toMatchObject({
      statusCode: 404,
      message: 'El mentor no existe o no está activo',
    });
  });

  it('valida los catalogos y activa al usuario autenticado', async () => {
    const activationResult = { id: userId };
    const findMentorRole = vi.fn().mockResolvedValue({ id: roleId });
    const findActiveUserRole = vi.fn().mockResolvedValue(null);
    const findTechnicalAreas = vi.fn().mockResolvedValue([
      { id: data.technicalAreaIds[0] },
    ]);
    const findActiveOrientationTypes = vi.fn().mockResolvedValue([
      { id: data.orientationTypeIds[0] },
    ]);
    const activate = vi.fn().mockResolvedValue(activationResult);
    const repository = {
      findMentorRole,
      findActiveUserRole,
      findTechnicalAreas,
      findActiveOrientationTypes,
      activate,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    const result = await service.activate(userId, data);

    expect(findMentorRole).toHaveBeenCalledTimes(1);
    expect(findActiveUserRole).toHaveBeenCalledWith(userId, roleId);
    expect(findTechnicalAreas).toHaveBeenCalledWith(data.technicalAreaIds);
    expect(findActiveOrientationTypes).toHaveBeenCalledWith(
      data.orientationTypeIds,
    );
    expect(activate).toHaveBeenCalledWith(
      userId,
      roleId,
      data.technicalAreaIds,
      data.orientationTypeIds,
    );
    expect(result).toBe(activationResult);
  });

  it('rechaza la activacion si no existe el rol mentor', async () => {
    const activate = vi.fn();
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue(null),
      activate,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    await expect(service.activate(userId, data)).rejects.toBeInstanceOf(
      MentorRoleNotFoundException,
    );
    expect(activate).not.toHaveBeenCalled();
  });

  it('rechaza la activacion si el usuario ya es mentor', async () => {
    const activate = vi.fn();
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue({ id: roleId }),
      findActiveUserRole: vi.fn().mockResolvedValue({ id: 'user-role-id' }),
      activate,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    await expect(service.activate(userId, data)).rejects.toBeInstanceOf(
      AlreadyMentorException,
    );
    expect(activate).not.toHaveBeenCalled();
  });

  it('rechaza la activacion si existen areas tecnicas invalidas', async () => {
    const activate = vi.fn();
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue({ id: roleId }),
      findActiveUserRole: vi.fn().mockResolvedValue(null),
      findTechnicalAreas: vi.fn().mockResolvedValue([]),
      activate,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    await expect(service.activate(userId, data)).rejects.toBeInstanceOf(
      InvalidTechnicalAreasException,
    );
    expect(activate).not.toHaveBeenCalled();
  });

  it('rechaza la activacion si existen orientaciones invalidas o inactivas', async () => {
    const activate = vi.fn();
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue({ id: roleId }),
      findActiveUserRole: vi.fn().mockResolvedValue(null),
      findTechnicalAreas: vi.fn().mockResolvedValue([
        { id: data.technicalAreaIds[0] },
      ]),
      findActiveOrientationTypes: vi.fn().mockResolvedValue([]),
      activate,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    await expect(service.activate(userId, data)).rejects.toBeInstanceOf(
      InvalidOrientationTypesException,
    );
    expect(activate).not.toHaveBeenCalled();
  });
});
