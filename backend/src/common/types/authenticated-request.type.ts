import type { Request } from 'express';
import type { AuthenticatedUser } from './authenticated-user.type.js';

// Request after JwtAuthGuard has verified the access token.
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
