import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/prisma/client.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const roleNames = ['titulado', 'estudiante', 'mentor', 'empresa', 'administrativo'] as const;

async function main() {
  for (const name of roleNames) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const tituladoRole = await prisma.role.findUniqueOrThrow({ where: { name: 'titulado' } });
  const passwordHash = await bcrypt.hash('Prueba123', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'prueba@umss.edu.bo' },
    update: { passwordHash },
    create: {
      firstName: 'Usuario',
      lastName: 'De Prueba',
      email: 'prueba@umss.edu.bo',
      passwordHash,
    },
  });

  const existingUserRole = await prisma.userRole.findFirst({
    where: { userId: testUser.id, roleId: tituladoRole.id, deletedAt: null },
  });
  if (!existingUserRole) {
    await prisma.userRole.create({ data: { userId: testUser.id, roleId: tituladoRole.id } });
  }

  console.log('Roles creados:', roleNames.join(', '));
  console.log('Usuario de prueba: prueba@umss.edu.bo / Prueba123 (rol: titulado)');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());