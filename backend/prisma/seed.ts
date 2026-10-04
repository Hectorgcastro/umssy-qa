import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/prisma/client.js';
import bcrypt from 'bcrypt';
import { buildDatabaseConnectionString } from '../src/common/prisma/build-connection-string.js';
import { ROLE_NAMES } from '../src/common/enums/roles.enum.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: buildDatabaseConnectionString() }),
});

// --- Existing reference UUIDs (HU-08-03 original seed) ---
const CATEGORY_TECNOLOGIA_ID = '22222222-2222-2222-2222-222222222221';
const MODALITY_PRESENCIAL_ID = '22222222-2222-2222-2222-222222222222';
const ORIGIN_INSTITUCIONAL_ID = '22222222-2222-2222-2222-222222222223';
const EVENT_STATUS_PUBLICADO_ID = '22222222-2222-2222-2222-222222222224';
const REG_STATUS_CONFIRMADA_ID = '22222222-2222-2222-2222-222222222225';

// --- Commit 1: missing reference rows ---
const EVENT_STATUS_BORRADOR_ID = '22222222-2222-2222-2222-222222222229';

// --- Commit 2: additional event category UUIDs ---
const CATEGORY_IA_DATOS_ID = '22222222-2222-2222-2222-222222222226';
const CATEGORY_DISENO_ID = '22222222-2222-2222-2222-222222222227';
const CATEGORY_SEGURIDAD_ID = '22222222-2222-2222-2222-222222222228';

// --- Commit 3: seed user UUIDs ---
const SEED_USERS_DATA = [
  { id: '11111111-1111-1111-1111-111111111111', firstName: 'Seed', lastName: 'User One', email: 'seed.user1@example.test' },
  { id: '11111111-1111-1111-1111-111111111112', firstName: 'Seed', lastName: 'User Two', email: 'seed.user2@example.test' },
  { id: '11111111-1111-1111-1111-111111111113', firstName: 'Seed', lastName: 'User Three', email: 'seed.user3@example.test' },
  { id: '11111111-1111-1111-1111-111111111114', firstName: 'Seed', lastName: 'User Four', email: 'seed.user4@example.test' },
  { id: '11111111-1111-1111-1111-111111111115', firstName: 'Seed', lastName: 'User Five', email: 'seed.user5@example.test' },
  { id: '11111111-1111-1111-1111-111111111116', firstName: 'Seed', lastName: 'User Six', email: 'seed.user6@example.test' },
];

// --- Commit 4: published event UUIDs ---
const EVENT_REACT_ID = '33333333-3333-3333-3333-333333333341';
const EVENT_IA_APLICADA_ID = '33333333-3333-3333-3333-333333333342';
const EVENT_DATA_SCIENCE_ID = '33333333-3333-3333-3333-333333333343';
const EVENT_UI_UX_ID = '33333333-3333-3333-3333-333333333344';
const EVENT_SEGURIDAD_BASICA_ID = '33333333-3333-3333-3333-333333333345';
const EVENT_NOSQL_ID = '33333333-3333-3333-3333-333333333346';

async function main() {
  for (const name of ROLE_NAMES) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  const tituladoRole = await prisma.role.findUniqueOrThrow({ where: { name: 'titulado' } });
  const password = await bcrypt.hash('Prueba123', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'prueba@umss.edu.bo' },
    update: { password },
    create: {
      firstName: 'Usuario',
      lastName: 'De Prueba',
      email: 'prueba@umss.edu.bo',
      password,
    },
  });

  const existingUserRole = await prisma.userRole.findFirst({
    where: { userId: testUser.id, roleId: tituladoRole.id, deletedAt: null },
  });
  if (!existingUserRole) {
    await prisma.userRole.create({ data: { userId: testUser.id, roleId: tituladoRole.id } });
  }

  console.log('Roles creados:', ROLE_NAMES.join(', '));
  console.log('Usuario de prueba: prueba@umss.edu.bo / Prueba123 (rol: titulado)');

  // --- Eventos & pases (HU-08-03) ---
  const category = await prisma.eventCategory.upsert({
    where: { id: CATEGORY_TECNOLOGIA_ID },
    update: {},
    create: { id: CATEGORY_TECNOLOGIA_ID, name: 'Tecnología' },
  });
  const modality = await prisma.eventModality.upsert({
    where: { id: MODALITY_PRESENCIAL_ID },
    update: {},
    create: { id: MODALITY_PRESENCIAL_ID, title: 'Presencial' },
  });
  const origin = await prisma.eventOrigin.upsert({
    where: { id: ORIGIN_INSTITUCIONAL_ID },
    update: {},
    create: { id: ORIGIN_INSTITUCIONAL_ID, title: 'Institucional' },
  });
  const eventStatus = await prisma.eventStatus.upsert({
    where: { id: EVENT_STATUS_PUBLICADO_ID },
    update: {},
    create: { id: EVENT_STATUS_PUBLICADO_ID, title: 'Publicado' },
  });
  const regStatus = await prisma.registrationStatus.upsert({
    where: { id: REG_STATUS_CONFIRMADA_ID },
    update: {},
    create: { id: REG_STATUS_CONFIRMADA_ID, title: 'Confirmada' },
  });

  const legacyEvents = [
    { id: '33333333-3333-3333-3333-333333333331', title: 'Taller de NestJS', date: '2026-10-20', location: 'Aula 101', enroll: true },
    { id: '33333333-3333-3333-3333-333333333332', title: 'Taller de Prisma', date: '2026-10-25', location: 'Laboratorio 2', enroll: true },
    { id: '33333333-3333-3333-3333-333333333333', title: 'Taller de Vitest', date: '2026-11-02', location: 'Aula 203', enroll: false },
  ];

  for (const e of legacyEvents) {
    await prisma.event.upsert({
      where: { id: e.id },
      update: {},
      create: {
        id: e.id,
        title: e.title,
        description: 'Evento de prueba',
        instructorName: 'Instructor Demo',
        eventDate: new Date(e.date),
        startTime: new Date('1970-01-01T09:00:00.000Z'),
        endTime: new Date('1970-01-01T12:00:00.000Z'),
        location: e.location,
        capacity: 30,
        supportThreshold: 0,
        categoryId: category.id,
        modalityId: modality.id,
        originId: origin.id,
        statusId: eventStatus.id,
        createdById: testUser.id,
      },
    });

    if (e.enroll) {
      await prisma.eventRegistration.upsert({
        where: { eventId_userId: { eventId: e.id, userId: testUser.id } },
        update: {},
        create: {
          eventId: e.id,
          userId: testUser.id,
          statusId: regStatus.id,
          qrToken: `qr-seed-${e.id.slice(-4)}`,
        },
      });
    }
  }

  console.log('Eventos de prueba creados; usuario inscrito en 2 de 3');

  // --- Commit 1: missing reference rows ---
  await prisma.eventStatus.upsert({
    where: { id: EVENT_STATUS_BORRADOR_ID },
    update: {},
    create: { id: EVENT_STATUS_BORRADOR_ID, title: 'Borrador' },
  });
  console.log('Reference rows ensured: EventStatus(Borrador)');

  // --- Commit 2: event categories in contract order ---
  // Tecnología already exists (CATEGORY_TECNOLOGIA_ID). Create the remaining three sequentially.
  await prisma.eventCategory.upsert({
    where: { id: CATEGORY_IA_DATOS_ID },
    update: {},
    create: { id: CATEGORY_IA_DATOS_ID, name: 'IA & Datos' },
  });
  await prisma.eventCategory.upsert({
    where: { id: CATEGORY_DISENO_ID },
    update: {},
    create: { id: CATEGORY_DISENO_ID, name: 'Diseño' },
  });
  await prisma.eventCategory.upsert({
    where: { id: CATEGORY_SEGURIDAD_ID },
    update: {},
    create: { id: CATEGORY_SEGURIDAD_ID, name: 'Seguridad' },
  });
  console.log('Event categories ensured: Tecnología, IA & Datos, Diseño, Seguridad');

  // --- Commit 3: 6 seed users ---
  const seedUsers = [];
  for (const u of SEED_USERS_DATA) {
    const user = await prisma.user.upsert({
      where: { id: u.id },
      update: { firstName: u.firstName, lastName: u.lastName, email: u.email, password },
      create: {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        password,
      },
    });
    seedUsers.push(user);
  }
  console.log('Seed users ensured: 6 users');

  // --- Commit 4: 6 published events with varied capacity ---
  const publishedEventsConfig = [
    {
      id: EVENT_REACT_ID,
      title: 'Desarrollo Web con React',
      description: 'Aprende desarrollo frontend moderno con React y Hooks.',
      categoryId: CATEGORY_TECNOLOGIA_ID,
      instructorName: 'Carlos Mendoza',
      eventDate: '2026-10-15',
      startTime: '09:00',
      endTime: '13:00',
      capacity: 10,
      modalityId: MODALITY_PRESENCIAL_ID,
    },
    {
      id: EVENT_IA_APLICADA_ID,
      title: 'Inteligencia Artificial Aplicada',
      description: 'Fundamentos de IA y modelos generativos para la industria.',
      categoryId: CATEGORY_IA_DATOS_ID,
      instructorName: 'Elena Rostova',
      eventDate: '2026-10-17',
      startTime: '14:00',
      endTime: '18:00',
      capacity: 8,
      modalityId: MODALITY_PRESENCIAL_ID,
    },
    {
      id: EVENT_DATA_SCIENCE_ID,
      title: 'Data Science con Python',
      description: 'Análisis de datos, pandas y visualización práctica.',
      categoryId: CATEGORY_IA_DATOS_ID,
      instructorName: null,
      eventDate: '2026-10-22',
      startTime: '09:00',
      endTime: '12:00',
      capacity: 6,
      modalityId: null,
    },
    {
      id: EVENT_UI_UX_ID,
      title: 'Diseño UI/UX para Móviles',
      description: 'Taller intensivo de diseño de interfaces móviles.',
      categoryId: CATEGORY_DISENO_ID,
      instructorName: 'Sofía Vargas',
      eventDate: '2026-10-29',
      startTime: '15:00',
      endTime: '18:00',
      capacity: 2,
      modalityId: MODALITY_PRESENCIAL_ID,
    },
    {
      id: EVENT_SEGURIDAD_BASICA_ID,
      title: 'Seguridad Informática Básica',
      description: 'Principios fundamentales de ciberseguridad y protección de datos.',
      categoryId: CATEGORY_SEGURIDAD_ID,
      instructorName: null,
      eventDate: '2026-11-05',
      startTime: '10:00',
      endTime: '14:00',
      capacity: null,
      modalityId: null,
    },
    {
      id: EVENT_NOSQL_ID,
      title: 'Bases de Datos NoSQL',
      description: 'Introducción a modelos de datos no relacionales y MongoDB.',
      categoryId: CATEGORY_TECNOLOGIA_ID,
      instructorName: 'Roberto Gómez',
      eventDate: '2026-11-12',
      startTime: '09:00',
      endTime: '13:00',
      capacity: 12,
      modalityId: MODALITY_PRESENCIAL_ID,
    },
  ];

  for (const item of publishedEventsConfig) {
    const startTimeDate = new Date(`1970-01-01T${item.startTime}:00.000Z`);
    const endTimeDate = new Date(`1970-01-01T${item.endTime}:00.000Z`);

    await prisma.event.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        instructorName: item.instructorName,
        eventDate: new Date(item.eventDate),
        startTime: startTimeDate,
        endTime: endTimeDate,
        capacity: item.capacity,
        categoryId: item.categoryId,
        modalityId: item.modalityId ?? MODALITY_PRESENCIAL_ID,
        originId: ORIGIN_INSTITUCIONAL_ID,
        statusId: EVENT_STATUS_PUBLICADO_ID,
        createdById: seedUsers[0].id,
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        instructorName: item.instructorName,
        eventDate: new Date(item.eventDate),
        startTime: startTimeDate,
        endTime: endTimeDate,
        capacity: item.capacity,
        categoryId: item.categoryId,
        modalityId: item.modalityId ?? MODALITY_PRESENCIAL_ID,
        originId: ORIGIN_INSTITUCIONAL_ID,
        statusId: EVENT_STATUS_PUBLICADO_ID,
        createdById: seedUsers[0].id,
      },
    });
  }
  console.log('Published events ensured: 6 events with varied capacity');

  // --- Commit 5: registrations for full, partial and cancelled cases ---
  const registrationsConfig: Array<{
    eventId: string;
    userIndex: number;
    cancelled?: boolean;
  }> = [
    // React (6 active)
    { eventId: EVENT_REACT_ID, userIndex: 0 },
    { eventId: EVENT_REACT_ID, userIndex: 1 },
    { eventId: EVENT_REACT_ID, userIndex: 2 },
    { eventId: EVENT_REACT_ID, userIndex: 3 },
    { eventId: EVENT_REACT_ID, userIndex: 4 },
    { eventId: EVENT_REACT_ID, userIndex: 5 },

    // IA Aplicada (3 active)
    { eventId: EVENT_IA_APLICADA_ID, userIndex: 0 },
    { eventId: EVENT_IA_APLICADA_ID, userIndex: 1 },
    { eventId: EVENT_IA_APLICADA_ID, userIndex: 2 },

    // Data Science (4 active, 1 cancelled)
    { eventId: EVENT_DATA_SCIENCE_ID, userIndex: 0 },
    { eventId: EVENT_DATA_SCIENCE_ID, userIndex: 1 },
    { eventId: EVENT_DATA_SCIENCE_ID, userIndex: 2 },
    { eventId: EVENT_DATA_SCIENCE_ID, userIndex: 3 },
    { eventId: EVENT_DATA_SCIENCE_ID, userIndex: 4, cancelled: true },

    // UI/UX (2 active -> FULL 2/2)
    { eventId: EVENT_UI_UX_ID, userIndex: 0 },
    { eventId: EVENT_UI_UX_ID, userIndex: 1 },

    // Seguridad Básica (4 active -> capacity null)
    { eventId: EVENT_SEGURIDAD_BASICA_ID, userIndex: 0 },
    { eventId: EVENT_SEGURIDAD_BASICA_ID, userIndex: 1 },
    { eventId: EVENT_SEGURIDAD_BASICA_ID, userIndex: 2 },
    { eventId: EVENT_SEGURIDAD_BASICA_ID, userIndex: 3 },

    // NoSQL (5 active)
    { eventId: EVENT_NOSQL_ID, userIndex: 0 },
    { eventId: EVENT_NOSQL_ID, userIndex: 1 },
    { eventId: EVENT_NOSQL_ID, userIndex: 2 },
    { eventId: EVENT_NOSQL_ID, userIndex: 3 },
    { eventId: EVENT_NOSQL_ID, userIndex: 4 },
  ];

  for (const reg of registrationsConfig) {
    const user = seedUsers[reg.userIndex];
    const qrToken = `qr-seed-${reg.eventId.slice(-4)}-u${reg.userIndex + 1}`;
    const cancelledAt = reg.cancelled ? new Date('2026-10-01T10:00:00.000Z') : null;

    await prisma.eventRegistration.upsert({
      where: {
        eventId_userId: {
          eventId: reg.eventId,
          userId: user.id,
        },
      },
      update: {
        statusId: REG_STATUS_CONFIRMADA_ID,
        cancelledAt,
      },
      create: {
        eventId: reg.eventId,
        userId: user.id,
        statusId: REG_STATUS_CONFIRMADA_ID,
        qrToken,
        cancelledAt,
      },
    });
  }
  console.log('Event registrations ensured: 24 active, 1 cancelled');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
