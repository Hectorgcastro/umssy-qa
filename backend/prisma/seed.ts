import 'dotenv/config';

import { pathToFileURL } from 'node:url';

import { PrismaPg } from '@prisma/adapter-pg';
import { Logger } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import { ROLE_NAMES } from '../src/common/enums/roles.enum.js';
import { buildDatabaseConnectionString } from '../src/common/prisma/build-connection-string.js';
import { addWeeks, getWeekRange, toBoliviaTime } from '../src/common/utils/date-time.js';
import {
  BLOCK_MAX_HOUR,
  BLOCK_MIN_HOUR,
  BLOCK_STEP_MINUTES,
} from '../src/modules/availability/requests/create-block.request.js';
import { PrismaClient } from '../src/prisma/client.js';
import type { AppointmentStatus, Prisma, Role, User } from '../src/prisma/client.js';

export const STATUS_PENDING = 'PENDIENTE';
export const STATUS_CONFIRMED = 'CONFIRMADA';

export type SeedUserKey = 'mentorA' | 'mentorB' | 'titulado' | 'estudiante';

export const SEED_USERS: ReadonlyArray<{ key: SeedUserKey; nombre: string; apellido: string; correo: string }> = [
  { key: 'mentorA', nombre: 'Mentor', apellido: 'Alfa', correo: 'mentor.a@umssy.test' },
  { key: 'mentorB', nombre: 'Mentor', apellido: 'Beta', correo: 'mentor.b@umssy.test' },
  { key: 'titulado', nombre: 'Titulado', apellido: 'Uno', correo: 'titulado.1@umssy.test' },
  { key: 'estudiante', nombre: 'Estudiante', apellido: 'Uno', correo: 'estudiante.1@umssy.test' },
];

const CORREOS_SEED = SEED_USERS.map((usuario) => usuario.correo);

const CONTRASENA_SEED = 'Prueba123';
const RONDAS_BCRYPT = 10;

const USUARIO_PRUEBA = {
  correo: 'prueba@umss.edu.bo',
  nombre: 'Usuario',
  apellido: 'De Prueba',
};

// Roles creados por versiones anteriores de este seed: vienen en mayúscula y
// el login de Epic 1 solo reconoce ROLE_NAMES (minúscula).
const ROLES_HEREDADOS = ['MENTOR', 'TITULADO'];

const EsquemaEntorno = z.object({
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_SCHEMA: z.string().min(1).optional(),
});

export type SeedEnv = z.infer<typeof EsquemaEntorno>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): SeedEnv {
  const resultado = EsquemaEntorno.safeParse(source);
  if (!resultado.success) {
    const detalle = resultado.error.issues
      .map((issue) => `${issue.path.join('.') || '(raíz)'}: ${issue.message}`)
      .join(' | ');
    throw new Error(`Configuración de base de datos inválida — ${detalle}`);
  }
  return resultado.data;
}

export function createSeedClient(env: SeedEnv = loadEnv()): PrismaClient {
  const adapter = new PrismaPg(
    { connectionString: buildDatabaseConnectionString() },
    env.DB_SCHEMA ? { schema: env.DB_SCHEMA } : undefined,
  );
  return new PrismaClient({ adapter });
}

const MS_PER_DAY = 86_400_000;
const MS_PER_MINUTE = 60_000;
const PASO_MS = BLOCK_STEP_MINUTES * MS_PER_MINUTE;

export type WeekRange = { inicio: Date; fin: Date };
export type SeedWeeks = { anterior: WeekRange; actual: WeekRange; siguiente: WeekRange };

const semanaDe = (referencia: Date): WeekRange => {
  const rango = getWeekRange(referencia);
  return { inicio: new Date(rango.startAt), fin: new Date(addWeeks(rango.startAt, 1)) };
};

// Semana de lunes a domingo en hora de Bolivia, con `fin` exclusivo.
export function getWeeks(now: Date = new Date()): SeedWeeks {
  const actual = semanaDe(now);
  return {
    anterior: semanaDe(new Date(actual.inicio.getTime() - 7 * MS_PER_DAY)),
    actual,
    siguiente: semanaDe(new Date(actual.inicio.getTime() + 7 * MS_PER_DAY)),
  };
}

const minutosEn = (hora: number, minuto = 0): number => hora * 60 + minuto;

const instanteEn = (semana: WeekRange, dia: number, minutosDelDia: number): Date =>
  new Date(semana.inicio.getTime() + dia * MS_PER_DAY + minutosDelDia * MS_PER_MINUTE);

export type BlockSeed = { inicio: Date; fin: Date };

const bloqueEn = (semana: WeekRange, dia: number, minutosDelDia: number): BlockSeed => {
  const inicio = instanteEn(semana, dia, minutosDelDia);
  return { inicio, fin: new Date(inicio.getTime() + PASO_MS) };
};

export function pastBlockRange(week: WeekRange, now: Date): BlockSeed | null {
  const aperturaLunes = instanteEn(week, 0, minutosEn(BLOCK_MIN_HOUR));
  const cierreLunes = new Date(aperturaLunes.getTime() + 60 * MS_PER_MINUTE);
  if (now.getTime() >= cierreLunes.getTime()) {
    return { inicio: aperturaLunes, fin: cierreLunes };
  }

  const finTramoCerrado = new Date(Math.floor(now.getTime() / PASO_MS) * PASO_MS);
  const inicioTramoCerrado = new Date(finTramoCerrado.getTime() - PASO_MS);
  if (inicioTramoCerrado.getTime() >= aperturaLunes.getTime()) {
    return { inicio: inicioTramoCerrado, fin: finTramoCerrado };
  }

  return null;
}

export type BlockPlan = {
  bloques: BlockSeed[];
  libre: BlockSeed;
  pendiente: BlockSeed;
  confirmada: BlockSeed;
  pasado: BlockSeed | null;
  semanaTrio: WeekRange;
  avisos: string[];
};

const BLOQUES_POR_DIA = 8;

function construirCincuentaBloques(week: WeekRange): BlockSeed[] {
  const bloques: BlockSeed[] = [];
  for (let dia = 0; dia < 7 && bloques.length < 50; dia += 1) {
    const porDia = dia < 6 ? BLOQUES_POR_DIA : 2;
    for (let turno = 0; turno < porDia && bloques.length < 50; turno += 1) {
      bloques.push(bloqueEn(week, dia, minutosEn(BLOCK_MIN_HOUR, turno * BLOCK_STEP_MINUTES)));
    }
  }
  return bloques;
}

type PosicionTrio = { inicio: Date; semana: WeekRange };

// Primer horario futuro que permita tres bloques de 30 minutos dentro de la
// ventana 07:00-22:00 (el tercero debe terminar antes de las 22:00).
function elegirTrio(ahora: Date, semanas: SeedWeeks): PosicionTrio {
  const duracion = 3 * PASO_MS;
  const apertura = minutosEn(BLOCK_MIN_HOUR);
  const cierre = BLOCK_MAX_HOUR * 60;
  const futuro = new Date(Math.ceil((ahora.getTime() + PASO_MS) / PASO_MS) * PASO_MS);

  if (futuro.getTime() < semanas.actual.fin.getTime()) {
    const diaActual = Math.floor((futuro.getTime() - semanas.actual.inicio.getTime()) / MS_PER_DAY);
    for (let dia = diaActual; dia < 7; dia += 1) {
      const aperturaDia = instanteEn(semanas.actual, dia, apertura);
      const inicio = new Date(Math.max(futuro.getTime(), aperturaDia.getTime()));
      const { hours, minutes } = toBoliviaTime(inicio);
      const minutosDelDia = hours * 60 + minutes;
      const cabe =
        minutosDelDia + duracion / MS_PER_MINUTE <= cierre &&
        inicio.getTime() + duracion <= semanas.actual.fin.getTime();
      if (cabe) {
        return { inicio, semana: semanas.actual };
      }
    }
  }

  // La semana actual ya no tiene espacio: 14:00 queda fuera de la franja de
  // los 50 bloques de la semana siguiente (07:00-10:30), así que no colisiona.
  return { inicio: instanteEn(semanas.siguiente, 0, 14 * 60), semana: semanas.siguiente };
}

export function buildBlockPlan(weeks: SeedWeeks, now: Date = new Date()): BlockPlan {
  const avisos: string[] = [];

  const semanaPasada = [
    bloqueEn(weeks.anterior, 1, minutosEn(BLOCK_MIN_HOUR)),
    bloqueEn(weeks.anterior, 1, minutosEn(BLOCK_MIN_HOUR, BLOCK_STEP_MINUTES)),
  ];

  const posicion = elegirTrio(now, weeks);
  const libre = { inicio: posicion.inicio, fin: new Date(posicion.inicio.getTime() + PASO_MS) };
  const pendiente = {
    inicio: new Date(libre.inicio.getTime() + PASO_MS),
    fin: new Date(libre.inicio.getTime() + 2 * PASO_MS),
  };
  const confirmada = {
    inicio: new Date(libre.inicio.getTime() + 2 * PASO_MS),
    fin: new Date(libre.inicio.getTime() + 3 * PASO_MS),
  };

  const pasado = pastBlockRange(weeks.actual, now);
  if (pasado === null) {
    avisos.push(
      'Ejecución muy temprana en lunes: no se pudo crear el bloque pasado dentro de la ventana 07:00-22:00 de la semana actual.',
    );
  }
  if (posicion.semana !== weeks.actual) {
    avisos.push(
      'La semana actual ya no tiene horario disponible: los bloques de prueba (libre, pendiente y confirmada) se crearon en la semana siguiente.',
    );
  }

  return {
    bloques: [
      ...semanaPasada,
      ...(pasado === null ? [] : [pasado]),
      libre,
      pendiente,
      confirmada,
      ...construirCincuentaBloques(weeks.siguiente),
    ],
    libre,
    pendiente,
    confirmada,
    pasado,
    semanaTrio: posicion.semana,
    avisos,
  };
}

type SeedUsers = Record<SeedUserKey, User>;

async function limpiar(tx: Prisma.TransactionClient): Promise<number> {
  const encontrados = await tx.user.findMany({ where: { email: { in: CORREOS_SEED } }, select: { id: true } });
  const ids = encontrados.map((usuario) => usuario.id);
  if (ids.length === 0) {
    return 0;
  }

  await tx.appointment.deleteMany({ where: { OR: [{ mentorId: { in: ids } }, { studentId: { in: ids } }] } });
  await tx.availabilityBlock.deleteMany({ where: { mentorId: { in: ids } } });
  await tx.user.deleteMany({ where: { id: { in: ids } } });
  return ids.length;
}

async function sembrarRoles(tx: Prisma.TransactionClient): Promise<{ mentor: Role; titulado: Role; estudiante: Role }> {
  await tx.role.createMany({ data: ROLE_NAMES.map((nombre) => ({ name: nombre })), skipDuplicates: true });

  const mentor = await tx.role.findUniqueOrThrow({ where: { name: 'mentor' } });
  const titulado = await tx.role.findUniqueOrThrow({ where: { name: 'titulado' } });
  const estudiante = await tx.role.findUniqueOrThrow({ where: { name: 'estudiante' } });

  return { mentor, titulado, estudiante };
}

async function limpiarRolesHeredados(tx: Prisma.TransactionClient): Promise<number> {
  const heredados = await tx.role.findMany({ where: { name: { in: ROLES_HEREDADOS } }, select: { id: true } });
  if (heredados.length === 0) {
    return 0;
  }

  const ids = heredados.map((rol) => rol.id);
  const referencias = await tx.userRole.count({ where: { roleId: { in: ids } } });
  if (referencias > 0) {
    return 0;
  }

  const { count } = await tx.role.deleteMany({ where: { id: { in: ids } } });
  return count;
}

async function sembrarEstados(tx: Prisma.TransactionClient): Promise<{ pendiente: AppointmentStatus; confirmada: AppointmentStatus }> {
  const asegurar = (titulo: string) =>
    tx.appointmentStatus.upsert({ where: { title: titulo }, create: { title: titulo }, update: {} });

  return { pendiente: await asegurar(STATUS_PENDING), confirmada: await asegurar(STATUS_CONFIRMED) };
}

async function sembrarUsuarioDePrueba(tx: Prisma.TransactionClient, clave: string, rol: Role): Promise<void> {
  const usuario = await tx.user.upsert({
    where: { email: USUARIO_PRUEBA.correo },
    update: { password: clave },
    create: {
      firstName: USUARIO_PRUEBA.nombre,
      lastName: USUARIO_PRUEBA.apellido,
      email: USUARIO_PRUEBA.correo,
      password: clave,
    },
  });

  const rolAsignado = await tx.userRole.findFirst({
    where: { userId: usuario.id, roleId: rol.id, deletedAt: null },
  });
  if (!rolAsignado) {
    await tx.userRole.create({ data: { userId: usuario.id, roleId: rol.id } });
  }
}

async function sembrarUsuarios(tx: Prisma.TransactionClient, claves: string[]): Promise<SeedUsers> {
  await tx.user.createMany({
    data: SEED_USERS.map((usuario, posicion) => ({
      firstName: usuario.nombre,
      lastName: usuario.apellido,
      email: usuario.correo,
      password: claves[posicion],
    })),
  });

  const creados = await tx.user.findMany({ where: { email: { in: CORREOS_SEED } } });
  const porCorreo = new Map(creados.map((usuario) => [usuario.email, usuario]));

  return {
    mentorA: porCorreo.get(SEED_USERS[0].correo) as User,
    mentorB: porCorreo.get(SEED_USERS[1].correo) as User,
    titulado: porCorreo.get(SEED_USERS[2].correo) as User,
    estudiante: porCorreo.get(SEED_USERS[3].correo) as User,
  };
}

async function sembrarRolesDeUsuario(
  tx: Prisma.TransactionClient,
  usuarios: SeedUsers,
  roles: { mentor: Role; titulado: Role; estudiante: Role },
): Promise<number> {
  const { count } = await tx.userRole.createMany({
    data: [
      { userId: usuarios.mentorA.id, roleId: roles.mentor.id },
      { userId: usuarios.mentorB.id, roleId: roles.mentor.id },
      { userId: usuarios.titulado.id, roleId: roles.titulado.id },
      { userId: usuarios.estudiante.id, roleId: roles.estudiante.id },
    ],
  });
  return count;
}

async function sembrarBloques(tx: Prisma.TransactionClient, mentorId: string, plan: BlockPlan): Promise<number> {
  const { count } = await tx.availabilityBlock.createMany({
    data: plan.bloques.map((bloque) => ({ mentorId, startAt: bloque.inicio, endAt: bloque.fin })),
  });
  return count;
}

async function sembrarCitas(
  tx: Prisma.TransactionClient,
  usuarios: SeedUsers,
  estados: { pendiente: AppointmentStatus; confirmada: AppointmentStatus },
  plan: BlockPlan,
): Promise<number> {
  const bloquesDelTrio = await tx.availabilityBlock.findMany({
    where: { mentorId: usuarios.mentorA.id, startAt: { gte: plan.semanaTrio.inicio, lt: plan.semanaTrio.fin } },
    select: { id: true, startAt: true },
  });
  const idPorInicio = new Map(bloquesDelTrio.map((bloque) => [bloque.startAt.getTime(), bloque.id]));

  const bloquePendiente = idPorInicio.get(plan.pendiente.inicio.getTime());
  const bloqueConfirmado = idPorInicio.get(plan.confirmada.inicio.getTime());
  if (!bloquePendiente || !bloqueConfirmado) {
    throw new Error('No se encontraron los bloques de prueba para crear las citas de la semana del trío.');
  }

  // En HU-04 el que reserva la sesión es el titulado.
  const cita = (bloque: BlockSeed, blockId: string, statusId: string, mensaje: string) => ({
    blockId,
    mentorId: usuarios.mentorA.id,
    studentId: usuarios.titulado.id,
    startAt: bloque.inicio,
    endAt: bloque.fin,
    statusId,
    message: mensaje,
  });

  const { count } = await tx.appointment.createMany({
    data: [
      cita(plan.pendiente, bloquePendiente, estados.pendiente.id, 'Cita de prueba pendiente (seed de desarrollo)'),
      cita(plan.confirmada, bloqueConfirmado, estados.confirmada.id, 'Cita de prueba confirmada (seed de desarrollo)'),
    ],
  });
  return count;
}

export type SeedSummary = {
  semanas: SeedWeeks;
  plan: BlockPlan;
  roles: number;
  estados: number;
  usuarios: number;
  rolesDeUsuario: number;
  bloques: number;
  citas: number;
  usuariosEliminados: number;
  rolesHeredados: number;
  avisos: string[];
};

export async function runSeed(client?: PrismaClient): Promise<SeedSummary> {
  const esDuenoDelCliente = client === undefined;
  const prisma = client ?? createSeedClient();

  try {
    const ahora = new Date();
    const semanas = getWeeks(ahora);
    const plan = buildBlockPlan(semanas, ahora);
    const claves = await Promise.all(SEED_USERS.map(() => bcrypt.hash(CONTRASENA_SEED, RONDAS_BCRYPT)));
    const clavePrueba = await bcrypt.hash(CONTRASENA_SEED, RONDAS_BCRYPT);

    return await prisma.$transaction(
      async (tx) => {
        const usuariosEliminados = await limpiar(tx);
        const roles = await sembrarRoles(tx);
        const rolesHeredados = await limpiarRolesHeredados(tx);
        const estados = await sembrarEstados(tx);
        await sembrarUsuarioDePrueba(tx, clavePrueba, roles.titulado);
        const usuarios = await sembrarUsuarios(tx, claves);
        const rolesDeUsuario = await sembrarRolesDeUsuario(tx, usuarios, roles);
        const bloques = await sembrarBloques(tx, usuarios.mentorA.id, plan);
        const citas = await sembrarCitas(tx, usuarios, estados, plan);

        return {
          semanas,
          plan,
          roles: ROLE_NAMES.length,
          estados: Object.keys(estados).length,
          usuarios: SEED_USERS.length,
          rolesDeUsuario,
          bloques,
          citas,
          usuariosEliminados,
          rolesHeredados,
          avisos: plan.avisos,
        };
      },
      { maxWait: 5_000, timeout: 30_000 },
    );
  } finally {
    if (esDuenoDelCliente) {
      await prisma.$disconnect();
    }
  }
}

async function main(): Promise<void> {
  const registro = new Logger('Seed');
  let cliente: PrismaClient | undefined;

  try {
    cliente = createSeedClient();
    const resumen = await runSeed(cliente);
    registro.log(
      `Seed completado — roles: ${resumen.roles}, estados: ${resumen.estados}, usuarios: ${resumen.usuarios}, ` +
        `roles de usuario: ${resumen.rolesDeUsuario}, bloques: ${resumen.bloques}, citas: ${resumen.citas}` +
        (resumen.usuariosEliminados > 0
          ? ` (re-ejecución: ${resumen.usuariosEliminados} usuario(s) de prueba reemplazados)`
          : '') +
        (resumen.rolesHeredados > 0 ? ` (roles en mayúscula eliminados: ${resumen.rolesHeredados})` : ''),
    );
    for (const aviso of resumen.avisos) {
      registro.warn(aviso);
    }
  } catch (error) {
    registro.error('El seed falló y la transacción se revirtió', error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  } finally {
    await cliente?.$disconnect();
  }
}

const isDirectRun = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  void main();
}
