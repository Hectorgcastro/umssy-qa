import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ROLE_NAMES, type RoleName } from '../../../common/enums/roles.enum.js';
import { AuthService } from '../../auth/services/auth.service.js';
import { ForbiddenRoleException, UnauthorizedSessionException } from '../exceptions/index.js';
import type { BackofficeRequest } from '../types/authenticated-request.types.js';

const BACKOFFICE_ROLE: RoleName = 'administrativo';
const BEARER_PREFIX = 'Bearer ';

// Guard local del backoffice: valida el JWT Bearer y exige el rol administrativo
// TODO: reemplazar por el guard oficial cuando Pablo lo defina
@Injectable()
export class BackofficeGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<BackofficeRequest>();
    const header = request.headers.authorization;
    if (!header?.startsWith(BEARER_PREFIX)) {
      throw new UnauthorizedSessionException();
    }

    let payload: { sub?: unknown; roleTag?: unknown };
    try {
      payload = await this.jwtService.verifyAsync(header.slice(BEARER_PREFIX.length).trim());
    } catch {
      throw new UnauthorizedSessionException('La sesión no es válida o expiró');
    }

    const roleTag = (ROLE_NAMES as readonly unknown[]).includes(payload.roleTag) ? (payload.roleTag as RoleName) : undefined;
    if (typeof payload.sub !== 'string' || !roleTag) {
      throw new UnauthorizedSessionException('La sesión no es válida o expiró');
    }
    if (roleTag !== BACKOFFICE_ROLE) {
      throw new ForbiddenRoleException();
    }

    const user = await this.authService.getSessionUser(payload.sub);
    if (!user) {
      throw new UnauthorizedSessionException('La sesión no es válida o expiró');
    }

    request.user = { id: user.id, email: user.email, roles: [roleTag] };
    return true;
  }
}
