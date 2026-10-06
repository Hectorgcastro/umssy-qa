import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PreviewStep } from '../components/preview-step';
import type { VacancyConditions } from '../hooks/use-job-offer-form';

describe('PreviewStep', () => {
  const mockConditions: VacancyConditions = {
    title: 'Ingeniero de Software',
    modality: 'Remoto',
    mapsLink: 'https://maps.test',
    contractType: 'Medio tiempo',
    category: 'IT',
    vacancyCount: '5',
    salary: 'Bs 10.000',
    languages: 'Inglés'
  };

  // Funciones simuladas para satisfacer las propiedades requeridas
  const mockOnSubmit = vi.fn();
  const mockOnBack = vi.fn();

  it('renderiza correctamente con los datos ingresados', () => {
    render(
        <PreviewStep 
            conditions={mockConditions} 
            isLoading={false}
            error={null}
            onSubmit={mockOnSubmit}
            onBack={mockOnBack}
        />
    );
    expect(screen.getByText('Ingeniero de Software')).toBeInTheDocument();
    expect(screen.getByText('Remoto')).toBeInTheDocument();
    expect(screen.getByText('IT')).toBeInTheDocument();
    expect(screen.getByText('5 vacantes')).toBeInTheDocument();
    expect(screen.getByText('Bs 10.000')).toBeInTheDocument();
    expect(screen.getByText('Inglés')).toBeInTheDocument();
  });

  it('renderiza valores por defecto si los datos están vacíos', () => {
    const emptyConditions: VacancyConditions = {
      title: '', modality: null, mapsLink: '', contractType: '',
      category: '', vacancyCount: '', salary: '', languages: ''
    };
    render(
        <PreviewStep 
            conditions={emptyConditions} 
            isLoading={false}
            error={null}
            onSubmit={mockOnSubmit}
            onBack={mockOnBack}
        />
    );
    
    expect(screen.getByText('Desarrollador Backend')).toBeInTheDocument();
    expect(screen.getByText('Híbrido')).toBeInTheDocument();
    expect(screen.getByText('Tecnología')).toBeInTheDocument();
    expect(screen.getByText('Bs 6.500 - 8.000')).toBeInTheDocument();
  });
});