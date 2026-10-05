import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/prisma/client.js';
import bcrypt from 'bcrypt';
import { buildDatabaseConnectionString } from '../src/common/prisma/build-connection-string.js';
import { ROLE_NAMES } from '../src/common/enums/roles.enum.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: buildDatabaseConnectionString() }),
});

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

  // Usuario independiente para comprobar el estado vacío de Mis inscripciones.
  const emptyUser = await prisma.user.upsert({
    where: { email: 'sinpases@umss.edu.bo' },
    update: { password },
    create: {
      firstName: 'Usuario',
      lastName: 'Sin Pases',
      email: 'sinpases@umss.edu.bo',
      password,
    },
  });
  const emptyUserRole = await prisma.userRole.findFirst({
    where: { userId: emptyUser.id, roleId: tituladoRole.id, deletedAt: null },
  });
  if (!emptyUserRole) {
    await prisma.userRole.create({ data: { userId: emptyUser.id, roleId: tituladoRole.id } });
  }
  console.log('Usuario para estado vacío: sinpases@umss.edu.bo / Prueba123 (rol: titulado)');

  console.log('Roles creados:', ROLE_NAMES.join(', '));
  console.log('Usuario de prueba: prueba@umss.edu.bo / Prueba123 (rol: titulado)');

  // Catálogo de HU-08-01 y pases de ejemplo de HU-08-03.
  const categories = [];
  for (const name of ['Tecnología', 'IA & Datos', 'Diseño', 'Seguridad']) {
    categories.push(await prisma.eventCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    }));
  }
  const modality = await prisma.eventModality.upsert({
    where: { id: '22222222-2222-2222-2222-222222222222' },
    update: {},
    create: { id: '22222222-2222-2222-2222-222222222222', title: 'Presencial' },
  });
  const origin = await prisma.eventOrigin.upsert({
    where: { id: '22222222-2222-2222-2222-222222222223' },
    update: {},
    create: { id: '22222222-2222-2222-2222-222222222223', title: 'Institucional' },
  });
  const eventStatus = await prisma.eventStatus.upsert({
    where: { id: '22222222-2222-2222-2222-222222222224' },
    update: {},
    create: { id: '22222222-2222-2222-2222-222222222224', title: 'Publicado' },
  });
  const regStatus = await prisma.registrationStatus.upsert({
    where: { id: '22222222-2222-2222-2222-222222222225' },
    update: {},
    create: { id: '22222222-2222-2222-2222-222222222225', title: 'Confirmada' },
  });

  const events = [
    { id: '33333333-3333-3333-3333-333333333331', title: 'Taller de NestJS', date: '2026-10-20', location: 'Aula 101', enroll: true, categoryIndex: 0, capacity: 30 },
    { id: '33333333-3333-3333-3333-333333333332', title: 'Taller de Prisma', date: '2026-10-25', location: 'Laboratorio 2', enroll: true, categoryIndex: 0, capacity: 1 },
    { id: '33333333-3333-3333-3333-333333333333', title: 'Taller de Vitest', date: '2026-11-02', location: 'Aula 203', enroll: false, categoryIndex: 0, capacity: 30 },
    { id: '33333333-3333-3333-3333-333333333334', title: 'Desarrollo Web con React', date: '2026-11-03', location: 'Laboratorio 1', enroll: false, categoryIndex: 0, capacity: 30 },
    { id: '33333333-3333-3333-3333-333333333335', title: 'Data Science con Python', date: '2026-11-04', location: 'Laboratorio 3', enroll: false, categoryIndex: 1, capacity: 20 },
    { id: '33333333-3333-3333-3333-333333333336', title: 'Diseño de interfaces accesibles', date: '2026-11-05', location: 'Aula 204', enroll: false, categoryIndex: 2, capacity: 25 },
    { id: '33333333-3333-3333-3333-333333333337', title: 'Seguridad de aplicaciones web', date: '2026-11-06', location: 'Laboratorio 4', enroll: false, categoryIndex: 3, capacity: 20 },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { id: e.id },
      update: { capacity: e.capacity, categoryId: categories[e.categoryIndex].id },
      create: {
        id: e.id,
        title: e.title,
        description: 'Evento de prueba',
        instructorName: 'Instructor Demo',
        eventDate: new Date(e.date),
        startTime: new Date('1970-01-01T09:00:00.000Z'),
        endTime: new Date('1970-01-01T12:00:00.000Z'),
        location: e.location,
        capacity: e.capacity,
        supportThreshold: 0,
        categoryId: categories[e.categoryIndex].id,
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

  console.log('Catálogo: 4 categorías, 7 talleres y 2 pases; Taller de Prisma lleno (1/1).');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
