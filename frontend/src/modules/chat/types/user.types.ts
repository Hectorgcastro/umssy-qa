// modules/chat/types/user.types.ts

/**
 * Roles a user can have in the platform.
 * Mirrors the role.name values agreed with Epic 1 (see Epic9_BD sheet Dependencias).
 * Labels shown in the UI are in Spanish (see ROLE_LABELS below).
 */
export type UserRole =
  | 'STUDENT'
  | 'GRADUATE'
  | 'MENTOR'
  | 'RECRUITER'
  | 'ADMIN';

/**
 * Minimal user shape used by the chat module.
 * Aggregates fields from Epic 1 (user, role) and Epic 2 (user_profile)
 * so the frontend can render a user card without extra requests.
 *
 * When the real API arrives, this will be composed server-side from
 * user + user_profile + user_role joins.
 */
export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string | null;
  headline: string | null;   // from user_profile.headline
  isActive: boolean;         // from user.is_active
}

/**
 * Spanish labels for each role, shown in the UI.
 * Code stays in English; UI text in Spanish per DCS §2.1.
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  STUDENT: 'Estudiante',
  GRADUATE: 'Titulado',
  MENTOR: 'Mentor',
  RECRUITER: 'Empresa',
  ADMIN: 'Administrador',
};