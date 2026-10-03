/**
 * ARCHIVO PROVISIONAL (B-07, Epic 7).
 *
 * Epic 1 aún no entrega el login real. Mientras tanto, la "sesión" es el
 * header `x-user-id` con el UUID de un usuario existente y activo.
 * NO es seguro para producción: cualquiera puede suplantar a otro usuario.
 *
 * Al reemplazarlo por el login real, hay que borrar este guard y dejar que el
 * nuevo deje `request.user` con la misma forma (AuthenticatedUser).
 * RolesGuard y @Roles NO cambian.
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthenticatedUser } from '../decorators/roles.decorator.js';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class ProvisionalSessionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers['x-user-id'];

    if (typeof header !== 'string' || !UUID_REGEX.test(header)) {
      throw new UnauthorizedException(
        'Falta el header x-user-id o no es un UUID válido',
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { id: header, isActive: true },
      select: {
        id: true,
        email: true,
        roles: {
          // Solo roles vigentes: sin borrado lógico y ya iniciados
          where: { deletedAt: null, startAt: { lte: new Date() } },
          select: { role: { select: { name: true } } },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    const authenticated: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      roles: user.roles.map((userRole) => userRole.role.name),
    };
    request.user = authenticated;

    return true;
  }
}