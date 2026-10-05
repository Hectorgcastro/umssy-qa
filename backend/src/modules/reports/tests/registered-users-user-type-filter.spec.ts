import { ReportUsersRepository } from '../repositories/report-users.repository.js';
import {
  ALL_USER_TYPES,
  registeredUsersFiltersSchema,
  registeredUsersQuerySchema,
} from '../requests/report-users.schema.js';
import { ReportsService } from '../services/reports.service.js';
import {
  REPORT_USER_TYPES,
  type RegisteredUserResponse,
  type ReportRegistrationStatus,
  type ReportUser,
  type ReportUserType,
} from '../types/report-user.types.js';

// HU02 (Épica 10): filtro del reporte de usuarios registrados por tipo de usuario.

const PAGE_SIZE = 10;
const SAME_REGISTRATION_DATE = '2026-04-01T12:00:00.000Z';

// Usuarios aprobados por tipo: 10 y 11 cubren el borde de una página exacta,
// los titulados comparten fecha de registro y empresa no tiene registros.
const APPROVED_COUNT_BY_TYPE: Record<ReportUserType, number> = {
  STUDENT: 10,
  DEGREE_HOLDER: 23,
  MENTOR: 11,
  COMPANY: 0,
  ADMIN: 2,
};

const TOTAL_APPROVED = Object.values(APPROVED_COUNT_BY_TYPE).reduce(
  (total, count) => total + count,
  0,
);

const REQUIRED_FIELDS = [
  'fullName',
  'email',
  'userType',
  'identifier',
  'documentType',
  'registeredAt',
] as const;

function buildUser(
  userType: ReportUserType,
  index: number,
  registrationStatus: ReportRegistrationStatus = 'APPROVED',
): ReportUser {
  const id = `${userType.toLowerCase()}-${registrationStatus.toLowerCase()}-${String(index).padStart(2, '0')}`;
  // Los titulados comparten fecha para forzar el desempate por id.
  const registeredAt =
    userType === 'DEGREE_HOLDER'
      ? SAME_REGISTRATION_DATE
      : new Date(Date.UTC(2026, 0, 1 + index)).toISOString();

  return {
    id,
    fullName: `Nombre ${id}`,
    email: `${id}@example.com`,
    userType,
    identifier: `IDENT-${id}`,
    documentType: userType === 'COMPANY' ? 'NIT' : 'ACADEMIC_DEGREE',
    registeredAt,
    registrationStatus,
    rejectionReason: registrationStatus === 'REJECTED' ? 'Sin documento' : null,
  };
}

function buildDataset(): ReportUser[] {
  const approved = REPORT_USER_TYPES.flatMap((userType) =>
    Array.from({ length: APPROVED_COUNT_BY_TYPE[userType] }, (_, index) =>
      buildUser(userType, index),
    ),
  );
  // Pendientes y rechazados de todos los tipos (incluida empresa) que nunca
  // deben aparecer ni contarse en el reporte de registrados.
  const notApproved = REPORT_USER_TYPES.flatMap((userType) => [
    buildUser(userType, 0, 'PENDING'),
    buildUser(userType, 0, 'REJECTED'),
  ]);

  // Orden mezclado: el resultado no debe depender del orden de origen.
  return [...approved, ...notApproved].sort((first, second) =>
    first.email.length % 3 === second.email.length % 3
      ? second.id.localeCompare(first.id)
      : (first.email.length % 3) - (second.email.length % 3),
  );
}

function buildService(users: readonly ReportUser[]): ReportsService {
  const repository = new ReportUsersRepository();
  vi.spyOn(repository, 'findAll').mockReturnValue(users);
  return new ReportsService(repository);
}

const query = (input: Record<string, unknown> = {}) =>
  registeredUsersQuerySchema.parse(input);

// Recorre todas las páginas de un filtro, como lo haría la tabla.
function collectAllPages(
  service: ReportsService,
  userType?: string,
): RegisteredUserResponse[][] {
  const firstPage = service.getRegisteredUsers(query({ userType }));

  return Array.from(
    { length: firstPage.totalPages },
    (_, index) =>
      service.getRegisteredUsers(query({ userType, page: index + 1 })).items,
  );
}

describe('Reporte de usuarios registrados: filtro por tipo de usuario (HU02)', () => {
  const dataset = buildDataset();
  const service = buildService(dataset);

  describe('CA 3 y CA 11: sin filtro o con "Todos"', () => {
    it.each([
      { case: 'sin userType', input: {} },
      { case: 'con userType=ALL', input: { userType: ALL_USER_TYPES } },
    ])('devuelve los aprobados de todos los tipos $case', ({ input }) => {
      const result = service.getRegisteredUsers(query(input));

      expect(result.totalItems).toBe(TOTAL_APPROVED);
      expect(result.totalPages).toBe(Math.ceil(TOTAL_APPROVED / PAGE_SIZE));
      expect(result.items).toHaveLength(PAGE_SIZE);
    });

    it('"Todos" y omitir el parámetro devuelven exactamente lo mismo', () => {
      expect(collectAllPages(service, ALL_USER_TYPES)).toEqual(
        collectAllPages(service),
      );
    });

    it('incluye registros de todos los tipos que tienen aprobados', () => {
      const userTypes = new Set(
        collectAllPages(service)
          .flat()
          .map((user) => user.userType),
      );

      expect([...userTypes].sort()).toEqual(
        REPORT_USER_TYPES.filter(
          (userType) => APPROVED_COUNT_BY_TYPE[userType] > 0,
        ).sort(),
      );
    });

    it('nunca incluye usuarios pendientes ni rechazados', () => {
      const ids = collectAllPages(service)
        .flat()
        .map((user) => user.id);

      expect(ids.some((id) => /pending|rejected/.test(id))).toBe(false);
    });
  });

  describe('CA 4 y CA 5: filtrado exacto por tipo de usuario', () => {
    it('acepta solo los 5 tipos de usuario del reporte', () => {
      expect(REPORT_USER_TYPES).toEqual([
        'STUDENT',
        'DEGREE_HOLDER',
        'MENTOR',
        'COMPANY',
        'ADMIN',
      ]);
    });

    it.each(['GRADUATE', 'Egresado', 'egresado', 'EGRESADO'])(
      'rechaza el tipo de usuario %s por no existir',
      (userType) => {
        const result = registeredUsersQuerySchema.safeParse({ userType });

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].path).toEqual(['userType']);
      },
    );

    it.each(REPORT_USER_TYPES)(
      'con userType=%s solo devuelve usuarios de ese tipo',
      (userType) => {
        const users = collectAllPages(service, userType).flat();

        expect(users).toHaveLength(APPROVED_COUNT_BY_TYPE[userType]);
        expect(users.every((user) => user.userType === userType)).toBe(true);
      },
    );
  });

  describe('CA 6 y CA 27: totales calculados sobre el subconjunto filtrado', () => {
    it.each(REPORT_USER_TYPES)(
      'totalItems y totalPages de %s no usan el total general',
      (userType) => {
        const result = service.getRegisteredUsers(query({ userType }));
        const expectedTotal = APPROVED_COUNT_BY_TYPE[userType];

        expect(result.totalItems).toBe(expectedTotal);
        expect(result.totalPages).toBe(Math.ceil(expectedTotal / PAGE_SIZE));
        expect(result.totalItems).not.toBe(TOTAL_APPROVED);
      },
    );

    it('los totales no cambian según la página consultada', () => {
      const totals = [1, 2, 3, 4].map((page) => {
        const result = service.getRegisteredUsers(
          query({ userType: 'DEGREE_HOLDER', page }),
        );
        return [result.totalItems, result.totalPages];
      });

      expect(new Set(totals.map((total) => total.join('/'))).size).toBe(1);
      expect(totals[0]).toEqual([23, 3]);
    });
  });

  describe('CA 7 y CA 14: máximo 10 registros por página', () => {
    it('con exactamente 10 registros calcula una sola página', () => {
      const result = service.getRegisteredUsers(query({ userType: 'STUDENT' }));

      expect(result).toMatchObject({ totalItems: 10, totalPages: 1 });
      expect(result.items).toHaveLength(10);
    });

    it('con exactamente 10 registros la página 2 no existe y viene vacía', () => {
      const result = service.getRegisteredUsers(
        query({ userType: 'STUDENT', page: 2 }),
      );

      expect(result.items).toEqual([]);
      expect(result).toMatchObject({ totalItems: 10, totalPages: 1 });
    });

    it('con 11 registros calcula 2 páginas y la segunda tiene 1 registro', () => {
      const [firstPage, secondPage] = collectAllPages(service, 'MENTOR');

      expect(
        service.getRegisteredUsers(query({ userType: 'MENTOR' })).totalPages,
      ).toBe(2);
      expect(firstPage).toHaveLength(10);
      expect(secondPage).toHaveLength(1);
    });

    it('ninguna página supera los 10 registros', () => {
      for (const userType of [undefined, ...REPORT_USER_TYPES]) {
        for (const page of collectAllPages(service, userType)) {
          expect(page.length).toBeLessThanOrEqual(PAGE_SIZE);
        }
      }
    });

    it.each(['11', '50', '100'])(
      'rechaza un límite de %s registros',
      (limit) => {
        expect(registeredUsersQuerySchema.safeParse({ limit }).success).toBe(
          false,
        );
      },
    );
  });

  describe('CA 8: el filtro se mantiene al cambiar de página', () => {
    it.each(['DEGREE_HOLDER', 'MENTOR'] as const)(
      'todas las páginas de %s conservan el tipo de usuario',
      (userType) => {
        const pages = collectAllPages(service, userType);

        expect(pages.length).toBeGreaterThan(1);
        pages.forEach((page) => {
          expect(page.every((user) => user.userType === userType)).toBe(true);
        });
      },
    );
  });

  describe('CA 10: tipo de usuario sin registros', () => {
    it('devuelve una lista vacía con totales en 0', () => {
      const result = service.getRegisteredUsers(query({ userType: 'COMPANY' }));

      expect(result).toEqual({
        items: [],
        totalItems: 0,
        totalPages: 0,
        page: 1,
        limit: PAGE_SIZE,
      });
    });

    it('no completa con usuarios de otros tipos en ninguna página', () => {
      for (const page of [1, 2, 5]) {
        expect(
          service.getRegisteredUsers(query({ userType: 'COMPANY', page }))
            .items,
        ).toEqual([]);
      }
    });

    it('no cuenta a las empresas pendientes o rechazadas', () => {
      const notApprovedCompanies = dataset.filter(
        (user) =>
          user.userType === 'COMPANY' && user.registrationStatus !== 'APPROVED',
      );

      expect(notApprovedCompanies).toHaveLength(2);
      expect(
        service.getRegisteredUsers(query({ userType: 'COMPANY' })).totalItems,
      ).toBe(0);
    });
  });

  describe('CA 15 y CA 16: integridad de los 6 campos por usuario', () => {
    const sourceById = new Map(dataset.map((user) => [user.id, user]));

    it('cada fila trae solo el id y los 6 campos del reporte', () => {
      for (const user of collectAllPages(service).flat()) {
        expect(Object.keys(user).sort()).toEqual(
          ['id', ...REQUIRED_FIELDS].sort(),
        );
      }
    });

    it('los 6 campos de cada fila pertenecen al mismo usuario', () => {
      for (const user of collectAllPages(service).flat()) {
        const source = sourceById.get(user.id);

        expect(source).toBeDefined();
        for (const field of REQUIRED_FIELDS) {
          expect(user[field]).toBe(source?.[field]);
        }
      }
    });

    it('ningún campo llega vacío', () => {
      for (const user of collectAllPages(service, 'MENTOR').flat()) {
        for (const field of REQUIRED_FIELDS) {
          expect(user[field]).toBeTruthy();
        }
      }
    });
  });

  describe('CA 22 y CA 23: sin duplicados ni omisiones entre páginas', () => {
    it.each([undefined, ...REPORT_USER_TYPES])(
      'recorrer todas las páginas de %s devuelve cada usuario una sola vez',
      (userType) => {
        const { totalItems } = service.getRegisteredUsers(query({ userType }));
        const ids = collectAllPages(service, userType)
          .flat()
          .map((user) => user.id);

        expect(ids).toHaveLength(totalItems);
        expect(new Set(ids).size).toBe(totalItems);
      },
    );

    it('con fechas idénticas desempata por id en orden ascendente', () => {
      const ids = collectAllPages(service, 'DEGREE_HOLDER')
        .flat()
        .map((user) => user.id);

      expect(ids).toEqual([...ids].sort((a, b) => a.localeCompare(b)));
      expect(ids).toEqual(
        dataset
          .filter(
            (user) =>
              user.userType === 'DEGREE_HOLDER' &&
              user.registrationStatus === 'APPROVED',
          )
          .map((user) => user.id)
          .sort((a, b) => a.localeCompare(b)),
      );
    });

    it('ordena del más reciente al más antiguo', () => {
      const dates = collectAllPages(service, 'MENTOR')
        .flat()
        .map((user) => new Date(user.registeredAt).getTime());

      expect(dates).toEqual([...dates].sort((a, b) => b - a));
    });

    it('el orden no depende del orden en que llegan los datos', () => {
      const reversed = buildService([...dataset].reverse());

      expect(collectAllPages(reversed, 'DEGREE_HOLDER')).toEqual(
        collectAllPages(service, 'DEGREE_HOLDER'),
      );
      expect(collectAllPages(reversed)).toEqual(collectAllPages(service));
    });

    it('consultas repetidas de la misma página devuelven lo mismo', () => {
      const pageTwo = () =>
        service.getRegisteredUsers(
          query({ userType: 'DEGREE_HOLDER', page: 2 }),
        ).items;

      expect(pageTwo()).toEqual(pageTwo());
    });

    it('resiste un volumen alto de usuarios con la misma fecha', () => {
      const users = Array.from({ length: 1_000 }, (_, index) => ({
        ...buildUser('MENTOR', index),
        registeredAt: SAME_REGISTRATION_DATE,
      }));
      const ids = collectAllPages(buildService(users), 'MENTOR')
        .flat()
        .map((user) => user.id);

      expect(ids).toHaveLength(1_000);
      expect(new Set(ids).size).toBe(1_000);
    });
  });

  describe('Exportación CSV con el filtro de tipo de usuario', () => {
    it('"Todos" exporta lo mismo que omitir el filtro', () => {
      const all = service.exportRegisteredUsersCsv(
        registeredUsersFiltersSchema.parse({ userType: ALL_USER_TYPES }),
      );
      const omitted = service.exportRegisteredUsersCsv(
        registeredUsersFiltersSchema.parse({}),
      );

      expect(all.content).toBe(omitted.content);
      expect(all.content.trim().split('\r\n')).toHaveLength(TOTAL_APPROVED + 1);
    });

    it('un tipo sin registros exporta solo la cabecera', () => {
      const { content } = service.exportRegisteredUsersCsv(
        registeredUsersFiltersSchema.parse({ userType: 'COMPANY' }),
      );

      expect(content.trim().split('\r\n')).toHaveLength(1);
    });
  });
});
