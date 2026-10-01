import type { ReportUser } from '../types/report-user.types'

export function buildReportUser(overrides: Partial<ReportUser> = {}): ReportUser {
  return {
    id: 'user-1',
    fullName: 'Ana Pérez',
    email: 'ana.perez@example.com',
    userType: 'graduate',
    identifier: 'DEMO-UNI-001',
    document: 'Título académico',
    registeredAt: '2026-03-15T14:20:00.000Z',
    registrationStatus: 'approved',
    rejectionReason: null,
    ...overrides,
  }
}

export function buildApiPage(
  items: ReportUser[],
  { page = 1, limit = 10, total = items.length } = {},
) {
  return {
    data: {
      statusCode: 200,
      ok: true,
      detail: 'OK',
      page,
      data: { items, total, page, limit },
    },
  }
}
