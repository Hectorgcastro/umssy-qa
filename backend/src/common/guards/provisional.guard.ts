/**
 * ARCHIVO PROVISIONAL (B-07, Epic 7).
 *
 * Epic 1 entrega el login (POST /auth/login, PR #398) que firma un JWT con
 * { sub, roleTag }, pero todavía no entrega el guard ni el decorador de
 * usuario actual que lo verifiquen. Ese hueco lo cubre este guard: lee
 * `Authorization: Bearer <token>`, lo valida con JwtService.verify (secreto
 * de AuthModule) y recién ahí vuelve a consultar los roles vigentes del
 * usuario en Prisma por el `sub` del token.
 *
 * Se repite la consulta a Prisma (en vez de confiar en el `roleTag` del
 * payload) porque los roles tienen revocación (`deletedAt`) y activación
 * programada (`startAt`): un usuario puede perder o ganar un rol en medio
 * de la vigencia del token (hasta 8h), y el guard debe reflejar eso de
 * inmediato en vez de confiar en un claim que puede quedar desfasado.
 *
 * El módulo que aplique este guard debe importar AuthModule (expone
 * JwtModule) para poder inyectar JwtService.
 *
 * Al reemplazarlo por el guard oficial de Epic 1, hay que borrar este
 * archivo y dejar que el nuevo deje `request.user` con la misma forma
 * (AuthenticatedUser). RolesGuard y @Roles NO cambian.
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthenticatedUser } from '../decorators/roles.decorator.js';
import { UnauthorizedSessionException } from '../exceptions/unauthorized-session.exception.js';

interface LoginJwtPayload {
  sub: string;
  roleTag: string;
}

const BEARER_PREFIX = 'Bearer ';

@Injectable()
export class ProvisionalSessionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers['authorization'];

    if (typeof header !== 'string' || !header.startsWith(BEARER_PREFIX)) {
      throw new UnauthorizedSessionException(
        'Falta el header Authorization: Bearer <token>',
      );
    }

    const token = header.slice(BEARER_PREFIX.length);
    let payload: LoginJwtPayload;
    try {
      payload = this.jwtService.verify<LoginJwtPayload>(token);
    } catch {
      throw new UnauthorizedSessionException('Token inválido o expirado');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, isActive: true },
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
      throw new UnauthorizedSessionException('Usuario no encontrado o inactivo');
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
