/**
 * ÚNICA fuente de verdad de los roles (provisional hasta que Epic 1 los defina).
 * Para cambiar o agregar roles, se edita SOLO este archivo.
 * El seed (B-03) debe crear en la tabla `roles` exactamente estos nombres.
 */
export const ROLES = {
  MENTOR: 'MENTOR',
  TITULADO: 'TITULADO',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: RoleName[] = Object.values(ROLES);