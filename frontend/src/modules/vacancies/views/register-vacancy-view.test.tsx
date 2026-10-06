import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { RegisterVacancyView } from './register-vacancy-view';
import * as useJobOfferFormHook from '../hooks/use-job-offer-form';
import type { VacancyConditions } from '../hooks/use-job-offer-form';

vi.mock('../hooks/use-job-offer-form', () => ({
  useJobOfferForm: vi.fn(),
}));

vi.mock('../components/vacancy-stepper', () => ({
  VacancyStepper: () => <div data-testid="vacancy-stepper">Stepper</div>
}));
vi.mock('../components/information-step', () => ({
  InformationStep: () => <div data-testid="information-step">Paso 1</div>
}));
vi.mock('../components/preview-step', () => ({
  PreviewStep: ({ onPrevious }: { onPrevious: () => void }) => (
    <div data-testid="preview-step">
      Paso 3
      <button onClick={onPrevious}>Anterior</button>
    </div>
  )
}));

describe('RegisterVacancyView', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const mockConditions: VacancyConditions = {
    title: "",
    modality: null,
    mapsLink: "",
    contractType: "",
    category: "",
    vacancyCount: "",
    salary: "",
    languages: "",
    description: "",
    skills: [],
  };

  it('renderiza el paso 1 cuando currentStep es 1', () => {
    vi.spyOn(useJobOfferFormHook, 'useJobOfferForm').mockReturnValue({
      currentStep: 1,
      conditions: mockConditions,
      updateField: vi.fn(),
      selectModality: vi.fn(),
      goNext: vi.fn(),
      goBack: vi.fn(),
    });

    render(<RegisterVacancyView />);
    expect(screen.getByTestId('information-step')).toBeInTheDocument();
    expect(screen.queryByTestId('preview-step')).not.toBeInTheDocument();
  });

  it('renderiza el paso 3 cuando currentStep es 3', () => {
    const goBack = vi.fn();
    vi.spyOn(useJobOfferFormHook, 'useJobOfferForm').mockReturnValue({
      currentStep: 3,
      conditions: mockConditions,
      updateField: vi.fn(),
      selectModality: vi.fn(),
      goNext: vi.fn(),
      goBack,
    });

    render(<RegisterVacancyView />);
    expect(screen.getByTestId('preview-step')).toBeInTheDocument();
    expect(screen.queryByTestId('information-step')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(goBack).toHaveBeenCalledOnce();
  });
});
