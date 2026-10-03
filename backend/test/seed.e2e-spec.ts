import 'dotenv/config';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  createSeedClient,
  getWeeks,
  pastBlockRange,
  runSeed,
  SEED_USERS,
  STATUS_CONFIRMED,
  STATUS_PENDING,
} from '../prisma/seed.js';
import type { PrismaClient } from '../src/prisma/client.js';

const ALL_EMAILS = SEED_USERS.map((user) => user.email);
const emailOf = (key: (typeof SEED_USERS)[number]['key']): string =>
  SEED_USERS.find((user) => user.key === key)?.email ?? '';

const weeks = getWeeks(new Date());
const canHavePastBlock = pastBlockRange(weeks.actual, new Date()) !== null;

describe('Seed de desarrollo (e2e)', () => {
  let prisma: PrismaClient;

  const snapshot = async () => {
    const mentors = await prisma.user.findMany({ where: { email: { in: ALL_EMAILS } }, select: { id: true } });
    const mentorIds = mentors.map((mentor) => mentor.id);

    return {
      roles: await prisma.role.count(),
      statuses: await prisma.appointmentStatus.count(),
      users: await prisma.user.count({ where: { email: { in: ALL_EMAILS } } }),
      userRoles: await prisma.userRole.count({ where: { userId: { in: mentorIds } } }),
      blocks: await prisma.availabilityBlock.count({ where: { mentorId: { in: mentorIds } } }),
      appointments: await prisma.appointment.count({ where: { mentorId: { in: mentorIds } } }),
    };
  };

  beforeAll(async () => {
    prisma = createSeedClient();
    await runSeed(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('crea los usuarios de prueba con los roles MENTOR y TITULADO', async () => {
    const users = await prisma.user.findMany({
      where: { email: { in: ALL_EMAILS } },
      include: { roles: { include: { role: true } } },
    });

    expect(users).toHaveLength(SEED_USERS.length);

    const roleNames = (email: string) =>
      users.find((user) => user.email === email)?.roles.map((userRole) => userRole.role.name) ?? [];

    expect(roleNames(emailOf('mentorA'))).toContain('MENTOR');
    expect(roleNames(emailOf('mentorB'))).toContain('MENTOR');
    expect(roleNames(emailOf('titulado'))).toContain('TITULADO');
  });

  it('CA2: tiene un bloque libre, uno con cita pendiente y uno con cita confirmada en la semana actual', async () => {
    const blocks = await prisma.availabilityBlock.findMany({
      where: { startAt: { gte: weeks.actual.start, lt: weeks.actual.end } },
      include: { appointments: { include: { status: true } } },
    });

    expect(blocks.length).toBeGreaterThanOrEqual(3);

    const free = blocks.filter((block) => block.appointments.length === 0);
    const withPending = blocks.filter((block) =>
      block.appointments.some((appointment) => appointment.status.title === STATUS_PENDING),
    );
    const withConfirmed = blocks.filter((block) =>
      block.appointments.some((appointment) => appointment.status.title === STATUS_CONFIRMED),
    );

    expect(free.length).toBeGreaterThanOrEqual(1);
    expect(withPending).toHaveLength(1);
    expect(withConfirmed).toHaveLength(1);
  });

  // Solo es imposible si el seed corre un lunes antes de las 07:30 (hora de Bolivia).
  it.skipIf(!canHavePastBlock)('CA2/HU-04: tiene un bloque pasado dentro de la semana actual', async () => {
    const blocks = await prisma.availabilityBlock.findMany({
      where: { startAt: { gte: weeks.actual.start, lt: weeks.actual.end } },
      select: { endAt: true },
    });

    expect(blocks.some((block) => block.endAt.getTime() < Date.now())).toBe(true);
  });

  it('CA3: un mentor tiene 50 bloques en una semana y el otro no tiene ninguno', async () => {
    const mentorA = await prisma.user.findUniqueOrThrow({ where: { email: emailOf('mentorA') } });
    const mentorB = await prisma.user.findUniqueOrThrow({ where: { email: emailOf('mentorB') } });

    const grouped = await prisma.availabilityBlock.groupBy({
      by: ['mentorId'],
      where: {
        mentorId: { in: [mentorA.id, mentorB.id] },
        startAt: { gte: weeks.siguiente.start, lt: weeks.siguiente.end },
      },
      _count: { _all: true },
    });

    const blocksInNextWeek = (mentorId: string): number =>
      grouped.find((group) => group.mentorId === mentorId)?._count._all ?? 0;

    expect(blocksInNextWeek(mentorA.id)).toBe(50);
    expect(blocksInNextWeek(mentorB.id)).toBe(0);
  });

  it('CA4: correr el seed dos veces no duplica datos', async () => {
    const before = await snapshot();
    await runSeed(prisma);
    const after = await snapshot();

    expect(after).toEqual(before);
    expect(after.users).toBe(SEED_USERS.length);
    expect(after.blocks).toBeGreaterThanOrEqual(55);
    expect(after.appointments).toBe(2);
  });
});
