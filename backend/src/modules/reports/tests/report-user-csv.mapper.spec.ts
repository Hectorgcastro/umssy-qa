import {
  formatReportDate,
  toRegisteredUserCsvRow,
  toRejectedUserCsvRow,
} from '../mappers/report-user-csv.mapper.js';

describe('report-user-csv.mapper', () => {
  it('convierte un usuario en la fila con las etiquetas de la tabla', () => {
    const row = toRegisteredUserCsvRow({
      id: 'user-1',
      fullName: 'Ana Pérez',
      email: 'ana@example.com',
      userType: 'DEGREE_HOLDER',
      identifier: '201942394',
      documentType: 'NATIONAL_DEGREE',
      registeredAt: '2026-03-15T14:00:00.000Z',
    });

    expect(row).toEqual([
      'Ana Pérez',
      'ana@example.com',
      'Titulado',
      '201942394',
      'Título en provisión nacional',
      '15/03/2026',
    ]);
  });

  it('convierte un usuario rechazado en la fila de la tabla de rechazados', () => {
    const row = toRejectedUserCsvRow({
      id: 'user-1',
      fullName: 'Juan Peres',
      email: 'juan@example.com',
      identifier: '201900001',
      documentType: 'NIT',
      rejectionReason: 'Documento ilegible',
      registeredAt: '2026-03-15T14:00:00.000Z',
    });

    expect(row).toEqual([
      'Juan Peres',
      'juan@example.com',
      '201900001',
      'NIT',
      '15/03/2026',
    ]);
  });

  it('usa la hora de Bolivia para la fecha de registro', () => {
    // 02:00 UTC del 1 de enero todavía es 31 de diciembre en Bolivia (UTC-4).
    expect(formatReportDate('2026-01-01T02:00:00.000Z')).toBe('31/12/2025');
  });

  it('devuelve un guion si la fecha no es válida', () => {
    expect(formatReportDate('no-es-fecha')).toBe('-');
  });
});
