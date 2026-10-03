import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from './roles.decorator.js';

/**
 * Lee `request.user`, que deja ProvisionalSessionGuard (y luego el login
 * real de Epic 1). Separado de CurrentUser para poder probarlo sin pasar
 * por la maquinaria de createParamDecorator.
 */
export const getCurrentUser = (
  _data: unknown,
  context: ExecutionContext,
): AuthenticatedUser => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(getCurrentUser);
