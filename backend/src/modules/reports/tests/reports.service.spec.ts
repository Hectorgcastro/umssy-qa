import { ReportUsersRepository } from '../repositories/report-users.repository.js';
import {
  registeredUsersQuerySchema,
  rejectedUsersQuerySchema,
} from '../requests/report-users.schema.js';
import { ReportsService } from '../services/reports.service.js';
import type { ReportUser } from '../types/report-user.types.js';

function buildUser(overrides: Partial<ReportUser>): ReportUser {
  return {
    id: 'user-1',
    fullName: 'Usuario de prueba',
    email: 'usuario@example.com',
    userType: 'graduate',
    identifier: 'ID-1',
    document: 'Título académico',
    registeredAt: '2026-01-01T00:00:00.000Z',
    registrationStatus: 'approved',
    rejectionReason: null,
    ...overrides,
  };
}

const USERS: ReportUser[] = [
  buildUser({ id: 'a', fullName: 'Ana Pérez', registeredAt: '2026-03-01T00:00:00.000Z' }),
  buildUser({ id: 'b', fullName: 'Bruno Díaz', userType: 'company', registeredAt: '2026-05-01T00:00:00.000Z' }),
  buildUser({ id: 'c', fullName: 'Carla Ríos', userType: 'admin', registeredAt: '2025-02-01T00:00:00.000Z' }),
  buildUser({ id: 'd', fullName: 'Dario Paz', registrationStatus: 'pending' }),
  buildUser({ id: 'e', fullName: 'Elena Soto', identifier: null, registrationStatus: 'rejected', rejectionReason: 'Sin documento' }),
  buildUser({ id: 'f', fullName: 'Fabio León', registrationStatus: 'rejected', rejectionReason: 'Correo inválido', registeredAt: '2026-08-01T00:00:00.000Z' }),
];

function buildService(users: readonly ReportUser[] = USERS): ReportsService {
  const repository = new ReportUsersRepository();
  vi.spyOn(repository, 'findAll').mockReturnValue(users);
  return new ReportsService(repository);
}

const registeredQuery = (input: Record<string, unknown> = {}) =>
  registeredUsersQuerySchema.parse(input);
const rejectedQuery = (input: Record<string, unknown> = {}) =>
  rejectedUsersQuerySchema.parse(input);

describe('ReportsService', () => {
  describe('getRegisteredUsers', () => {
    it('devuelve solo aprobados, del más reciente al más antiguo', () => {
      const result = buildService().getRegisteredUsers(registeredQuery());

      expect(result.items.map((user) => user.id)).toEqual(['b', 'a', 'c']);
      expect(result).toMatchObject({ total: 3, page: 1, limit: 10 });
    });

    it.each([
      { userType: 'company', expectedId: 'b' },
      { userType: 'student', expectedId: 'student-1' },
    ])('filtra por tipo de usuario $userType', ({ userType, expectedId }) => {
      const service = buildService([
        ...USERS,
        buildUser({ id: 'student-1', userType: 'student' }),
      ]);
      const result = service.getRegisteredUsers(registeredQuery({ userType }));

      expect(result.items.map((user) => user.id)).toEqual([expectedId]);
    });

    it('filtra por gestión', () => {
      const result = buildService().getRegisteredUsers(
        registeredQuery({ year: '2025' }),
      );

      expect(result.items.map((user) => user.id)).toEqual(['c']);
    });

    it('busca sin distinguir mayúsculas ni tildes', () => {
      const result = buildService().getRegisteredUsers(
        registeredQuery({ search: 'PEREZ' }),
      );

      expect(result.items.map((user) => user.id)).toEqual(['a']);
    });

    it('busca también por correo e identificador', () => {
      const service = buildService([
        buildUser({ id: 'x', email: 'unico@example.com', identifier: 'NIT-777' }),
        buildUser({ id: 'y' }),
      ]);

      expect(
        service.getRegisteredUsers(registeredQuery({ search: 'unico@' })).items,
      ).toHaveLength(1);
      expect(
        service.getRegisteredUsers(registeredQuery({ search: 'nit-777' })).items,
      ).toHaveLength(1);
    });

    it('pagina los resultados', () => {
      const result = buildService().getRegisteredUsers(
        registeredQuery({ page: '2', limit: '2' }),
      );

      expect(result.items.map((user) => user.id)).toEqual(['c']);
      expect(result).toMatchObject({ total: 3, page: 2, limit: 2 });
    });
  });

  describe('getRejectedUsers', () => {
    it('devuelve solo rechazados con su motivo', () => {
      const result = buildService().getRejectedUsers(rejectedQuery());

      expect(result.items.map((user) => user.id)).toEqual(['f', 'e']);
      expect(result.items[0].rejectionReason).toBe('Correo inválido');
    });

    it('busca dentro de los rechazados aunque no tengan identificador', () => {
      const result = buildService().getRejectedUsers(
        rejectedQuery({ search: 'elena' }),
      );

      expect(result.items.map((user) => user.id)).toEqual(['e']);
    });
  });

  it('usa los datos de prueba del repositorio por defecto', () => {
    const service = new ReportsService(new ReportUsersRepository());

    const registered = service.getRegisteredUsers(registeredQuery());
    const rejected = service.getRejectedUsers(rejectedQuery());

    expect(registered.total).toBeGreaterThan(10);
    expect(rejected.total).toBeGreaterThan(0);
  });
});
