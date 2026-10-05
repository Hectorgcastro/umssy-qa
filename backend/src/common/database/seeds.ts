import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { seedUsers } from '../../modules/users/seeds/users.seed.js';
import { seedEvents } from '../../modules/events/seeds/events.seed.js';
import { seedEventRegistrations } from '../../modules/event-registrations/seeds/event-registrations.seed.js';
import {
  SEED_PASSWORD,
  SEED_USERS,
} from '../../modules/users/constants/seed-users.constants.js';
async function main(): Promise<void> {
  const prisma = new PrismaService();
  try {
    const password = await bcrypt.hash(SEED_PASSWORD, 10);
    await prisma.$transaction(
      async (tx) => {
        // Los usuarios preceden a los talleres y los talleres a las inscripciones por sus claves foráneas.
        const users = await seedUsers(tx, password);
        await seedEvents(tx, users.tituladoId);
        await seedEventRegistrations(tx, users.tituladoId);
      },
      { timeout: 60000 },
    );
    console.log(
      'Seed completado: cuatro categorías, siete talleres y dos pases; Taller de Prisma lleno (1/1).',
    );
    for (const user of SEED_USERS)
      console.log(`QA: ${user.email} / ${SEED_PASSWORD} (rol: titulado)`);
  } finally {
    await prisma.$disconnect();
  }
}
main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
