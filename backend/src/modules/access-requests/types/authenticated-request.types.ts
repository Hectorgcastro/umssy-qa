import type { RoleName } from '../../../common/enums/roles.enum.js';

export interface BackofficeUser {
  id: string;
  email: string;
  roles: RoleName[];
}

export interface BackofficeRequest {
  headers: { authorization?: string };
  user?: BackofficeUser;
}
