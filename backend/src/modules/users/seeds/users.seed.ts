import type { Prisma } from '../../../prisma/client.js';
import { ROLE_NAMES } from '../../../common/enums/roles.enum.js';
import { SEED_USERS } from '../constants/seed-users.constants.js';
import type { SeedUsers } from '../types/seed-users.types.js';
export async function seedUsers(
  tx: Prisma.TransactionClient,
  password: string,
): Promise<SeedUsers> {
  for (const name of ROLE_NAMES)
    await tx.role.upsert({ where: { name }, update: {}, create: { name } });
  const role = await tx.role.findUniqueOrThrow({ where: { name: 'titulado' } });
  const ids: string[] = [];
  for (const definition of SEED_USERS) {
    const user = await tx.user.upsert({
      where: { email: definition.email },
      update: { password },
      create: { ...definition, password },
    });
    if (
      !(await tx.userRole.findFirst({
        where: { userId: user.id, roleId: role.id, deletedAt: null },
      }))
    ) {
      await tx.userRole.create({ data: { userId: user.id, roleId: role.id } });
    }
    ids.push(user.id);
  }
  return { tituladoId: ids[0], emptyUserId: ids[1] };
}
