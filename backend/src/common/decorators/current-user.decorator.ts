import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UnauthorizedSessionException } from '../exceptions/unauthorized-session.exception.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.types.js';
import type { AuthenticatedUser } from '../types/authenticated-user.types.js';

export const getCurrentUser = (
  _data: unknown,
  context: ExecutionContext,
): AuthenticatedUser => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

  if (!request.user) {
    throw new UnauthorizedSessionException();
  }

  return request.user;
};

export const CurrentUser = createParamDecorator(getCurrentUser);
