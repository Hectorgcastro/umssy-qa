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
import type { SeedSummary } from '../prisma/seed.js';
import { ROLE_NAMES } from '../src/common/enums/roles.enum.js';
import type { PrismaClient } from '../src/prisma/client.js';

const CORREOS = SEED_USERS.map((usuario) => usuario.correo);
const correoDe = (clave: (typeof SEED_USERS)[number]['key']): string =>
  SEED_USERS.find((usuario) => usuario.key === clave)?.correo ?? '';

const CORREO_USUARIO_PRUEBA = 'prueba@umss.edu.bo';
const ROLES_HEREDADOS = ['MENTOR', 'TITULADO'];
const SEMANA_EN_MS = 7 * 86_400_000;

const semanasIniciales = getWeeks(new Date());
const puedeHaberBloquePasado = pastBlockRange(semanasIniciales.actual, new Date()) !== null;

describe('Seed de desarrollo (e2e)', () => {
  let prisma: PrismaClient;
  let resumen: SeedSummary;

  const instantanea = async () => {
    const semillas = await prisma.user.findMany({ where: { email: { in: CORREOS } }, select: { id: true } });
    const ids = semillas.map((usuario) => usuario.id);

    return {
      roles: await prisma.role.count(),
      estados: await prisma.appointmentStatus.count(),
      usuarios: await prisma.user.count({ where: { email: { in: CORREOS } } }),
      rolesDeUsuario: await prisma.userRole.count({ where: { userId: { in: ids } } }),
      bloques: await prisma.availabilityBlock.count({ where: { mentorId: { in: ids } } }),
      citas: await prisma.appointment.count({ where: { mentorId: { in: ids } } }),
    };
  };

  beforeAll(async () => {
    prisma = createSeedClient();
    resumen = await runSeed(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('crea los usuarios de prueba con los roles en minúscula de ROLE_NAMES', async () => {
    const usuarios = await prisma.user.findMany({
      where: { email: { in: CORREOS } },
      include: { roles: { include: { role: true } } },
    });

    expect(usuarios).toHaveLength(SEED_USERS.length);

    const rolesDe = (correo: string) =>
      usuarios.find((usuario) => usuario.email === correo)?.roles.map((userRole) => userRole.role.name) ?? [];

    expect(rolesDe(correoDe('mentorA'))).toContain('mentor');
    expect(rolesDe(correoDe('mentorB'))).toContain('mentor');
    expect(rolesDe(correoDe('titulado'))).toContain('titulado');
    expect(rolesDe(correoDe('estudiante'))).toContain('estudiante');
  });

  it('deja solo los roles de ROLE_NAMES y elimina los heredados en mayúscula', async () => {
    const encontrados = await prisma.role.findMany({
      where: { name: { in: [...ROLE_NAMES, ...ROLES_HEREDADOS] } },
    });
    const nombres = encontrados.map((rol) => rol.name);

    expect(nombres).toHaveLength(ROLE_NAMES.length);
    for (const nombre of ROLE_NAMES) {
      expect(nombres).toContain(nombre);
    }
    for (const nombre of ROLES_HEREDADOS) {
      expect(nombres).not.toContain(nombre);
    }
  });

  it('da contraseña a los cuatro usuarios del seed', async () => {
    const usuarios = await prisma.user.findMany({ where: { email: { in: CORREOS } } });

    expect(usuarios).toHaveLength(SEED_USERS.length);
    for (const usuario of usuarios) {
      expect(usuario.password).toBeTruthy();
    }
  });

  it('conserva el usuario provisional de Epic 1 con contraseña y rol titulado', async () => {
    const usuario = await prisma.user.findUniqueOrThrow({ where: { email: CORREO_USUARIO_PRUEBA } });

    expect(usuario.password).toBeTruthy();

    const roles = await prisma.userRole.findMany({ where: { userId: usuario.id }, include: { role: true } });
    expect(roles.map((userRole) => userRole.role.name)).toContain('titulado');
  });

  it('CA2: tiene un bloque libre, uno con cita pendiente y uno con cita confirmada', async () => {
    const { plan } = resumen;
    const bloques = await prisma.availabilityBlock.findMany({
      where: { startAt: { gte: plan.semanaTrio.inicio, lt: plan.semanaTrio.fin } },
      include: { appointments: { include: { status: true } } },
    });

    expect(bloques.length).toBeGreaterThanOrEqual(3);

    const libres = bloques.filter((bloque) => bloque.appointments.length === 0);
    const conPendiente = bloques.filter((bloque) =>
      bloque.appointments.some((cita) => cita.status.title === STATUS_PENDING),
    );
    const conConfirmada = bloques.filter((bloque) =>
      bloque.appointments.some((cita) => cita.status.title === STATUS_CONFIRMED),
    );

    expect(libres.length).toBeGreaterThanOrEqual(1);
    expect(conPendiente).toHaveLength(1);
    expect(conConfirmada).toHaveLength(1);
  });

  it('CA2/HU-04: libre, pendiente y confirmada están después de la hora de ejecución', async () => {
    const inicios = [resumen.plan.libre, resumen.plan.pendiente, resumen.plan.confirmada].map(
      (bloque) => bloque.inicio,
    );
    const bloques = await prisma.availabilityBlock.findMany({ where: { startAt: { in: inicios } } });

    expect(bloques).toHaveLength(3);

    const ahora = Date.now();
    for (const bloque of bloques) {
      expect(bloque.startAt.getTime()).toBeGreaterThan(ahora);
      expect(bloque.endAt.getTime()).toBeGreaterThan(ahora);
    }
  });

  // Solo es imposible si el seed corre un lunes antes de las 07:30 (hora de Bolivia).
  it.skipIf(!puedeHaberBloquePasado)('CA2/HU-04: tiene un bloque pasado dentro de la semana actual', async () => {
    const bloques = await prisma.availabilityBlock.findMany({
      where: { startAt: { gte: resumen.semanas.actual.inicio, lt: resumen.semanas.actual.fin } },
      select: { endAt: true },
    });

    expect(bloques.some((bloque) => bloque.endAt.getTime() < Date.now())).toBe(true);
  });

  it('CA3: un mentor tiene 50 bloques en una semana y el otro no tiene ninguno', async () => {
    const mentorA = await prisma.user.findUniqueOrThrow({ where: { email: correoDe('mentorA') } });
    const mentorB = await prisma.user.findUniqueOrThrow({ where: { email: correoDe('mentorB') } });
    const iniciosDelTrio = [resumen.plan.libre, resumen.plan.pendiente, resumen.plan.confirmada].map(
      (bloque) => bloque.inicio,
    );

    const agrupados = await prisma.availabilityBlock.groupBy({
      by: ['mentorId'],
      where: {
        mentorId: { in: [mentorA.id, mentorB.id] },
        startAt: {
          gte: resumen.semanas.siguiente.inicio,
          lt: resumen.semanas.siguiente.fin,
          notIn: iniciosDelTrio,
        },
      },
      _count: { _all: true },
    });

    const bloquesDe = (mentorId: string): number =>
      agrupados.find((grupo) => grupo.mentorId === mentorId)?._count._all ?? 0;

    expect(bloquesDe(mentorA.id)).toBe(50);
    expect(bloquesDe(mentorB.id)).toBe(0);
  });

  it('CA4: correr el seed dos veces no duplica datos', async () => {
    const antes = await instantanea();
    await runSeed(prisma);
    const despues = await instantanea();

    expect(despues).toEqual(antes);
    expect(despues.usuarios).toBe(SEED_USERS.length);
    expect(despues.bloques).toBeGreaterThanOrEqual(55);
    expect(despues.citas).toBe(2);
  });

  it('getWeeks mantiene el domingo 21:00 y 23:30 de Bolivia en la semana actual', () => {
    const domingosTarde = [new Date('2026-10-05T01:00:00.000Z'), new Date('2026-10-05T03:30:00.000Z')];

    for (const instante of domingosTarde) {
      const semanas = getWeeks(instante);

      expect(semanas.actual.inicio.getTime()).toBeLessThanOrEqual(instante.getTime());
      expect(instante.getTime()).toBeLessThan(semanas.actual.fin.getTime());
      expect(semanas.actual.fin.getTime() - semanas.actual.inicio.getTime()).toBe(SEMANA_EN_MS);
      expect(semanas.actual.inicio.getUTCDay()).toBe(1);
    }
  });
});
