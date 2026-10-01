import { describe, expect, it } from 'vitest'
import { formatReportDate } from '../utils/format-report-date'

describe('formatReportDate', () => {
  it('muestra la fecha como dd/mm/aaaa sin depender de la zona horaria', () => {
    expect(formatReportDate('2026-03-15T14:20:00.000Z')).toBe('15/03/2026')
    expect(formatReportDate('2026-01-01T00:30:00.000Z')).toBe('01/01/2026')
  })
})
