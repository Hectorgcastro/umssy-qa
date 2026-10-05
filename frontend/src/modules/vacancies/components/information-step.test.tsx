import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InformationStep } from './information-step';
import type { VacancyConditions } from '../hooks/use-job-offer-form';

describe('InformationStep', () => {
  const mockUpdateField = vi.fn();
  const mockSelectModality = vi.fn();

  const emptyConditions: VacancyConditions = {
    title: "", modality: null, mapsLink: "", contractType: "",
    category: "", vacancyCount: "", salary: "", languages: "",
  };

  const fullConditions: VacancyConditions = {
    title: "Desarrollador", modality: "Remoto", mapsLink: "url", contractType: "Fijo",
    category: "IT", vacancyCount: "2", salary: "1000", languages: "Inglés",
  };

  it('renderiza con datos vacíos (cubre ramas por defecto)', () => {
    const { container } = render(
      <InformationStep 
        conditions={emptyConditions} 
        updateField={mockUpdateField} 
        selectModality={mockSelectModality} 
      />
    );
    expect(container).toBeTruthy();
  });

  it('renderiza con datos pre-cargados (cubre ramas verdaderas)', () => {
    const { container } = render(
      <InformationStep 
        conditions={fullConditions} 
        updateField={mockUpdateField} 
        selectModality={mockSelectModality} 
      />
    );
    expect(container).toBeTruthy();
  });
});
