import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenException } from '../exceptions/invalid-token.exception.js';
import { MissingUserException } from '../exceptions/missing-user.exception.js';
import type { AccessTokenPayload } from '../types/access-token-payload.type.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.type.js';

const bearerPrefix = 'Bearer ';

// Verifies the access token issued by POST /auth/login and attaches the user to the request.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new MissingUserException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token);
      request.user = { userId: payload.sub, roleTag: payload.roleTag };
    } catch {
      throw new InvalidTokenException();
    }

    return true;
  }

  private extractToken(request: AuthenticatedRequest): string | undefined {
    const header = request.headers.authorization;

    if (!header?.startsWith(bearerPrefix)) {
      return undefined;
    }

    const token = header.slice(bearerPrefix.length).trim();
    return token.length > 0 ? token : undefined;
  }
}
