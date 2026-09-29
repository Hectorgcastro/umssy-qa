import { describe, expect, it } from 'vitest'
import {
  FIRST_MANAGEMENT_YEAR,
  buildManagementYearOptions,
} from '../utils/management-years'

describe('buildManagementYearOptions', () => {
  it('genera las gestiones desde el año actual hasta la primera, en orden descendente', () => {
    const options = buildManagementYearOptions(2023)

    expect(options.map((option) => option.label)).toEqual([
      '2023',
      '2022',
      '2021',
      '2020',
    ])
    expect(options[0]).toEqual({ value: '2023', label: '2023' })
  })

  it('incluye solo la primera gestión cuando el año actual coincide', () => {
    expect(buildManagementYearOptions(FIRST_MANAGEMENT_YEAR)).toHaveLength(1)
  })
})
