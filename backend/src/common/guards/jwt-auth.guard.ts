import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AUTHORIZATION_HEADER,
  BEARER_PREFIX,
} from '../constants/auth.constants.js';
import { UnauthorizedSessionException } from '../exceptions/unauthorized-session.exception.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.types.js';
import type { LoginJwtPayload } from '../types/login-jwt-payload.types.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers[AUTHORIZATION_HEADER];

    if (
      typeof authorization !== 'string' ||
      !authorization.startsWith(BEARER_PREFIX)
    ) {
      throw new UnauthorizedSessionException();
    }

    const token = authorization.slice(BEARER_PREFIX.length).trim();
    if (!token) {
      throw new UnauthorizedSessionException();
    }

    let payload: LoginJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<LoginJwtPayload>(token);
    } catch {
      throw new UnauthorizedSessionException();
    }

    if (!payload || typeof payload.sub !== 'string' || !payload.sub.trim()) {
      throw new UnauthorizedSessionException();
    }

    request.user = { id: payload.sub };

    return true;
  }
}
