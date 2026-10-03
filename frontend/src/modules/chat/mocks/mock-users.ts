// modules/chat/mocks/mock-users.ts

import { User, UserRole } from '../types/user.types';

/**
 * Identifier for the currently logged-in user.
 * Mirrors the "current-user" id already used in mock-conversations.ts
 * so that get-or-create logic can detect existing conversations.
 */
export const CURRENT_USER_ID = 'current-user';

/**
 * The user currently logged in to the app.
 * Excluded from search results per Rule R15.
 */
export const CURRENT_USER: User = {
  id: CURRENT_USER_ID,
  fullName: 'Yo Mismo',
  role: 'GRADUATE',
  avatarUrl: 'https://i.pravatar.cc/150?u=current-user',
  headline: 'Ingeniero de Sistemas',
  isActive: true,
};

/**
 * 30+ mock users for chat search and conversation creation.
 *
 * Edge cases required by the HU2 task:
 * - At least 30 users
 * - At least one without avatar (avatarUrl === null)
 * - At least one inactive (isActive === false)
 * - Various roles (GRADUATE, MENTOR, RECRUITER, ADMIN)
 *
 * IDs intentionally do NOT collide with CURRENT_USER_ID.
 */
const HAND_WRITTEN_USERS: User[] = [
  {
    id: 'user-101',
    fullName: 'Maria Peredo',
    role: 'RECRUITER',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    headline: 'Senior IT Recruiter',
    isActive: true,
  },
  {
    id: 'user-102',
    fullName: 'Pablo Perez',
    role: 'GRADUATE',
    avatarUrl: null, // edge case: user without avatar
    headline: 'Backend Developer',
    isActive: true,
  },
  {
    id: 'user-103',
    fullName: 'Mario Alcocer',
    role: 'MENTOR',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    headline: 'Cloud Architect · Mentor',
    isActive: true,
  },
  {
    id: 'user-104',
    fullName: 'Claudia Torrico',
    role: 'GRADUATE',
    avatarUrl: null,
    headline: 'QA Engineer',
    isActive: true,
  },
  {
    id: 'user-105',
    fullName: 'Ana Rojas',
    role: 'MENTOR',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-105',
    headline: 'Data Scientist · Mentor',
    isActive: true,
  },
  {
    id: 'user-106',
    fullName: 'Carlos Mendoza',
    role: 'GRADUATE',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-106',
    headline: 'Frontend Developer',
    isActive: true,
  },
  {
    id: 'user-107',
    fullName: 'Lucia Vargas',
    role: 'GRADUATE',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-107',
    headline: 'DevOps Engineer',
    isActive: true,
  },
  {
    id: 'user-108',
    fullName: 'Diego Quispe',
    role: 'GRADUATE',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-108',
    headline: 'Mobile Developer',
    isActive: false, // edge case: inactive user
  },
  {
    id: 'user-109',
    fullName: 'Valeria Suarez',
    role: 'RECRUITER',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-109',
    headline: 'Tech Recruiter',
    isActive: true,
  },
  {
    id: 'user-110',
    fullName: 'Roberto Flores',
    role: 'MENTOR',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-110',
    headline: 'Software Architect · Mentor',
    isActive: true,
  },
];

/**
 * Deterministic generator for the remaining users.
 * No randomness: same output every time you run the app or tests.
 */
const FIRST_NAMES = [
  'Andrea', 'Bruno', 'Camila', 'Daniel', 'Elena', 'Fabian', 'Gabriela', 'Hugo',
  'Irene', 'Javier', 'Karen', 'Luis', 'Marta', 'Nicolas', 'Olivia', 'Pedro',
  'Quintin', 'Rosa', 'Santiago', 'Teresa',
];

const LAST_NAMES = [
  'Aguilar', 'Bravo', 'Castro', 'Duran', 'Espinoza',
  'Fuentes', 'Gomez', 'Herrera', 'Ibarra', 'Jimenez',
];

const GENERATED_ROLES: UserRole[] = [
  'GRADUATE', 'GRADUATE', 'GRADUATE', 'MENTOR', 'RECRUITER', 'STUDENT',
];

const GENERATED_USERS: User[] = Array.from({ length: 30 }, (_, i) => {
  const idx = i + 111; // start at user-111
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[(i * 3) % LAST_NAMES.length];
  return {
    id: `user-${idx}`,
    fullName: `${first} ${last}`,
    role: GENERATED_ROLES[i % GENERATED_ROLES.length],
    avatarUrl: i % 7 === 0 ? null : `https://i.pravatar.cc/150?u=user-${idx}`,
    headline: null,
    isActive: i % 11 !== 0, // sprinkle a few inactive
  };
});

/**
 * Public list of all mock users: hand-written + generated.
 * Total: 10 + 30 = 40 users.
 */
export const MOCK_USERS: User[] = [...HAND_WRITTEN_USERS, ...GENERATED_USERS];

/**
 * Convenience lookup by id. Useful in Task 6 when resolving a contact
 * from a userId without re-scanning the array.
 */
export const MOCK_USER_BY_ID: Record<string, User> = Object.fromEntries(
  MOCK_USERS.map((u) => [u.id, u])
);