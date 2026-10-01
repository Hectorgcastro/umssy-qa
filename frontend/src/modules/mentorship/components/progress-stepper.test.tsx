import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, it, expect } from 'vitest'
import { ProgressStepper } from './progress-stepper'

afterEach(cleanup)

describe('ProgressStepper', () => {
  it('renderiza los cuatro pasos de la mentoría', () => {
    render(<ProgressStepper currentStep={1} />)

    expect(screen.getByText('Participación')).toBeDefined()
    expect(screen.getByText('Áreas técnicas')).toBeDefined()
    expect(screen.getByText('Tipos de orientación')).toBeDefined()
    expect(screen.getByText('Confirmación')).toBeDefined()
  })

  it('marca el paso actual como activo', () => {
    render(<ProgressStepper currentStep={2} />)

    const activeStep = screen.getByText('2')

    expect(activeStep.getAttribute('aria-current')).toBe('step')
  })

  it('marca como completados los pasos anteriores al actual', () => {
    render(<ProgressStepper currentStep={3} />)

    const stepOne = screen.getByText('1')
    const stepTwo = screen.getByText('2')
    const stepThree = screen.getByText('3')

    expect(stepOne.className).toContain('bg-accent')
    expect(stepTwo.className).toContain('bg-accent')
    expect(stepThree.className).toContain('bg-accent')
  })
})