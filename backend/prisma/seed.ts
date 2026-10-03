import 'dotenv/config';

import { pathToFileURL } from 'node:url';

import { PrismaPg } from '@prisma/adapter-pg';
import { Logger } from '@nestjs/common';
import { z } from 'zod';

import {
  BLOCK_MAX_HOUR,
  BLOCK_MIN_HOUR,
  BLOCK_STEP_MINUTES,
} from '../src/modules/availability/requests/create-block.request.js';
import { PrismaClient } from '../src/prisma/client.js';
import type { AppointmentStatus, Prisma, Role, User } from '../src/prisma/client.js';

const ROLE_MENTOR = 'MENTOR';
const ROLE_TITULADO = 'TITULADO';

export const STATUS_PENDING = 'PENDIENTE';
export const STATUS_CONFIRMED = 'CONFIRMADA';

type SeedUserKey = 'mentorA' | 'mentorB' | 'titulado' | 'estudiante';

export const SEED_USERS: ReadonlyArray<{ key: SeedUserKey; firstName: string; lastName: string; email: string }> = [
  { key: 'mentorA', firstName: 'Mentor', lastName: 'Alfa', email: 'mentor.a@umssy.test' },
  { key: 'mentorB', firstName: 'Mentor', lastName: 'Beta', email: 'mentor.b@umssy.test' },
  { key: 'titulado', firstName: 'Titulado', lastName: 'Uno', email: 'titulado.1@umssy.test' },
  { key: 'estudiante', firstName: 'Estudiante', lastName: 'Uno', email: 'estudiante.1@umssy.test' },
];

const SEED_EMAILS = SEED_USERS.map((user) => user.email);

const EnvSchema = z.object({
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_SCHEMA: z.string().min(1).optional(),
});

export type SeedEnv = z.infer<typeof EnvSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): SeedEnv {
  const parsed = EnvSchema.safeParse(source);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((issue) => `${issue.path.join('.') || '(raíz)'}: ${issue.message}`).join(' | ');
    throw new Error(`Configuración de base de datos inválida — ${detail}`);
  }
  return parsed.data;
}

export function buildDatabaseUrl(env: SeedEnv): string {
  const credentials = `${encodeURIComponent(env.DB_USER)}:${encodeURIComponent(env.DB_PASSWORD)}`;
  return `postgresql://${credentials}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
}

export function createSeedClient(env: SeedEnv = loadEnv()): PrismaClient {
  const adapter = new PrismaPg(
    { connectionString: buildDatabaseUrl(env) },
    env.DB_SCHEMA ? { schema: env.DB_SCHEMA } : undefined,
  );
  return new PrismaClient({ adapter });
}

const BOLIVIA_UTC_OFFSET_MINUTES = -240;
const MS_PER_DAY = 86_400_000;
const MS_PER_MINUTE = 60_000;

export type WeekRange = { start: Date; end: Date };
export type SeedWeeks = { anterior: WeekRange; actual: WeekRange; siguiente: WeekRange };

const asBoliviaWallClock = (date: Date): number => date.getTime() + BOLIVIA_UTC_OFFSET_MINUTES * MS_PER_MINUTE;

const fromBoliviaWallClock = (wallClock: number): Date =>
  new Date(wallClock - BOLIVIA_UTC_OFFSET_MINUTES * MS_PER_MINUTE);

const atBolivia = (weekStart: Date, dayIndex: number, minutesOfDay: number): Date =>
  new Date(weekStart.getTime() + dayIndex * MS_PER_DAY + minutesOfDay * MS_PER_MINUTE);

export function getWeeks(now: Date = new Date()): SeedWeeks {
  const wallClock = fromBoliviaWallClock(asBoliviaWallClock(now));
  const dayIndexFromMonday = (wallClock.getUTCDay() + 6) % 7;
  const mondayWallClock =
    Date.UTC(wallClock.getUTCFullYear(), wallClock.getUTCMonth(), wallClock.getUTCDate()) -
    dayIndexFromMonday * MS_PER_DAY;

  const week = (offset: number): WeekRange => ({
    start: fromBoliviaWallClock(mondayWallClock + offset * 7 * MS_PER_DAY),
    end: fromBoliviaWallClock(mondayWallClock + (offset * 7 + 7) * MS_PER_DAY),
  });

  return { anterior: week(-1), actual: week(0), siguiente: week(1) };
}

const minutesAt = (hour: number, minute = 0): number => hour * 60 + minute;

const blockAt = (week: WeekRange, dayIndex: number, minutesOfDay: number): BlockSeed => {
  const start = atBolivia(week.start, dayIndex, minutesOfDay);
  return { start, end: new Date(start.getTime() + BLOCK_STEP_MINUTES * MS_PER_MINUTE) };
};

export function pastBlockRange(week: WeekRange, now: Date): BlockSeed | null {
  const mondayOpen = atBolivia(week.start, 0, minutesAt(BLOCK_MIN_HOUR));
  const mondayClose = new Date(mondayOpen.getTime() + 60 * MS_PER_MINUTE);
  if (now.getTime() >= mondayClose.getTime()) {
    return { start: mondayOpen, end: mondayClose };
  }

  const lastClosedSlotEnd = new Date(Math.floor(now.getTime() / (BLOCK_STEP_MINUTES * MS_PER_MINUTE)) * (BLOCK_STEP_MINUTES * MS_PER_MINUTE));
  const lastClosedSlotStart = new Date(lastClosedSlotEnd.getTime() - BLOCK_STEP_MINUTES * MS_PER_MINUTE);
  if (lastClosedSlotStart.getTime() >= mondayOpen.getTime()) {
    return { start: lastClosedSlotStart, end: lastClosedSlotEnd };
  }

  return null;
}

export type BlockSeed = { start: Date; end: Date };

export type BlockPlan = {
  blocks: BlockSeed[];
  libre: BlockSeed;
  pendiente: BlockSeed;
  confirmada: BlockSeed;
  pasado: BlockSeed | null;
  warnings: string[];
};

const FIFTY_BLOCKS_PER_DAY = 8;

function buildFiftyBlocks(week: WeekRange): BlockSeed[] {
  const blocks: BlockSeed[] = [];
  for (let dayIndex = 0; dayIndex < 7 && blocks.length < 50; dayIndex += 1) {
    const perDay = dayIndex < 6 ? FIFTY_BLOCKS_PER_DAY : 2;
    for (let slot = 0; slot < perDay && blocks.length < 50; slot += 1) {
      blocks.push(blockAt(week, dayIndex, minutesAt(BLOCK_MIN_HOUR, slot * BLOCK_STEP_MINUTES)));
    }
  }
  return blocks;
}

export function buildBlockPlan(weeks: SeedWeeks, now: Date = new Date()): BlockPlan {
  const warnings: string[] = [];

  const semanaPasada = [
    blockAt(weeks.anterior, 1, minutesAt(BLOCK_MIN_HOUR)),
    blockAt(weeks.anterior, 1, minutesAt(BLOCK_MIN_HOUR, BLOCK_STEP_MINUTES)),
  ];

  const libre = blockAt(weeks.actual, 2, minutesAt(BLOCK_MIN_HOUR));
  const pendiente = blockAt(weeks.actual, 2, minutesAt(BLOCK_MIN_HOUR, BLOCK_STEP_MINUTES));
  const confirmada = blockAt(weeks.actual, 2, minutesAt(BLOCK_MIN_HOUR, 2 * BLOCK_STEP_MINUTES));

  const pasado = pastBlockRange(weeks.actual, now);
  if (pasado === null) {
    warnings.push(
      'Ejecución muy temprana en lunes: no se pudo crear el bloque pasado dentro de la ventana 07:00-22:00 de la semana actual.',
    );
  }

  const semanaSiguiente = buildFiftyBlocks(weeks.siguiente);

  const semanaActual = pasado === null ? [libre, pendiente, confirmada] : [pasado, libre, pendiente, confirmada];

  return {
    blocks: [...semanaPasada, ...semanaActual, ...semanaSiguiente],
    libre,
    pendiente,
    confirmada,
    pasado,
    warnings,
  };
}

type SeedUsers = Record<SeedUserKey, User>;

async function clean(tx: Prisma.TransactionClient): Promise<number> {
  const found = await tx.user.findMany({ where: { email: { in: SEED_EMAILS } }, select: { id: true } });
  const ids = found.map((user) => user.id);
  if (ids.length === 0) {
    return 0;
  }

  await tx.appointment.deleteMany({ where: { OR: [{ mentorId: { in: ids } }, { studentId: { in: ids } }] } });
  await tx.availabilityBlock.deleteMany({ where: { mentorId: { in: ids } } });
  await tx.user.deleteMany({ where: { id: { in: ids } } });
  return ids.length;
}

async function seedRoles(tx: Prisma.TransactionClient): Promise<{ mentor: Role; titulado: Role }> {
  const upsertRole = (name: string) => tx.role.upsert({ where: { name }, create: { name }, update: {} });
  return { mentor: await upsertRole(ROLE_MENTOR), titulado: await upsertRole(ROLE_TITULADO) };
}

async function seedStatuses(tx: Prisma.TransactionClient): Promise<{ pending: AppointmentStatus; confirmed: AppointmentStatus }> {
  const upsertStatus = (title: string) =>
    tx.appointmentStatus.upsert({ where: { title }, create: { title }, update: {} });
  return { pending: await upsertStatus(STATUS_PENDING), confirmed: await upsertStatus(STATUS_CONFIRMED) };
}

async function seedUsers(tx: Prisma.TransactionClient): Promise<SeedUsers> {
  await tx.user.createMany({
    data: SEED_USERS.map(({ firstName, lastName, email }) => ({ firstName, lastName, email })),
  });

  const created = await tx.user.findMany({ where: { email: { in: SEED_EMAILS } } });
  const byEmail = new Map(created.map((user) => [user.email, user]));

  return {
    mentorA: byEmail.get(SEED_USERS[0].email) as User,
    mentorB: byEmail.get(SEED_USERS[1].email) as User,
    titulado: byEmail.get(SEED_USERS[2].email) as User,
    estudiante: byEmail.get(SEED_USERS[3].email) as User,
  };
}

async function seedUserRoles(tx: Prisma.TransactionClient, users: SeedUsers, roles: { mentor: Role; titulado: Role }): Promise<void> {
  await tx.userRole.createMany({
    data: [
      { userId: users.mentorA.id, roleId: roles.mentor.id },
      { userId: users.mentorB.id, roleId: roles.mentor.id },
      { userId: users.titulado.id, roleId: roles.titulado.id },
    ],
  });
}

async function seedBlocks(tx: Prisma.TransactionClient, mentorId: string, plan: BlockPlan): Promise<void> {
  await tx.availabilityBlock.createMany({
    data: plan.blocks.map((block) => ({ mentorId, startAt: block.start, endAt: block.end })),
  });
}

async function seedAppointments(
  tx: Prisma.TransactionClient,
  users: SeedUsers,
  statuses: { pending: AppointmentStatus; confirmed: AppointmentStatus },
  plan: BlockPlan,
  weeks: SeedWeeks,
): Promise<void> {
  const currentWeekBlocks = await tx.availabilityBlock.findMany({
    where: { mentorId: users.mentorA.id, startAt: { gte: weeks.actual.start, lt: weeks.actual.end } },
    select: { id: true, startAt: true },
  });
  const idByStart = new Map(currentWeekBlocks.map((block) => [block.startAt.getTime(), block.id]));

  const pendingBlockId = idByStart.get(plan.pendiente.start.getTime());
  const confirmedBlockId = idByStart.get(plan.confirmada.start.getTime());
  if (!pendingBlockId || !confirmedBlockId) {
    throw new Error('No se encontraron los bloques de la semana actual para crear las citas de prueba.');
  }

  const appointment = (block: BlockSeed, blockId: string, statusId: string, message: string) => ({
    blockId,
    mentorId: users.mentorA.id,
    studentId: users.estudiante.id,
    startAt: block.start,
    endAt: block.end,
    statusId,
    message,
  });

  await tx.appointment.createMany({
    data: [
      appointment(plan.pendiente, pendingBlockId, statuses.pending.id, 'Cita de prueba pendiente (seed de desarrollo)'),
      appointment(plan.confirmada, confirmedBlockId, statuses.confirmed.id, 'Cita de prueba confirmada (seed de desarrollo)'),
    ],
  });
}

export type SeedSummary = {
  roles: number;
  statuses: number;
  users: number;
  userRoles: number;
  blocks: number;
  appointments: number;
  removedUsers: number;
  warnings: string[];
};

export async function runSeed(client?: PrismaClient): Promise<SeedSummary> {
  const ownsClient = client === undefined;
  const prisma = client ?? createSeedClient();

  try {
    return await prisma.$transaction(async (tx) => {
      const now = new Date();
      const weeks = getWeeks(now);
      const plan = buildBlockPlan(weeks, now);

      const removedUsers = await clean(tx);
      const roles = await seedRoles(tx);
      const statuses = await seedStatuses(tx);
      const users = await seedUsers(tx);
      await seedUserRoles(tx, users, roles);
      await seedBlocks(tx, users.mentorA.id, plan);
      await seedAppointments(tx, users, statuses, plan, weeks);

      return {
        roles: 2,
        statuses: 2,
        users: SEED_USERS.length,
        userRoles: 3,
        blocks: plan.blocks.length,
        appointments: 2,
        removedUsers,
        warnings: plan.warnings,
      };
    });
  } finally {
    if (ownsClient) {
      await prisma.$disconnect();
    }
  }
}

async function main(): Promise<void> {
  const log = new Logger('Seed');
  let client: PrismaClient | undefined;

  try {
    client = createSeedClient();
    const summary = await runSeed(client);
    log.log(
      `Seed completado — roles: ${summary.roles}, estados: ${summary.statuses}, usuarios: ${summary.users}, ` +
        `roles de usuario: ${summary.userRoles}, bloques: ${summary.blocks}, citas: ${summary.appointments}` +
        (summary.removedUsers > 0 ? ` (re-ejecución: ${summary.removedUsers} usuario(s) de prueba reemplazados)` : ''),
    );
    for (const warning of summary.warnings) {
      log.warn(warning);
    }
  } catch (error) {
    log.error('El seed falló y la transacción se revirtió', error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  } finally {
    await client?.$disconnect();
  }
}

const isDirectRun = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  void main();
}
