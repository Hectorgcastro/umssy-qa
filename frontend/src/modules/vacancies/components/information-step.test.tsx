import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { InformationStep } from './information-step';
import { VacancyConditions } from '../hooks/use-job-offer-form';

describe('InformationStep', () => {
  afterEach(() => {
    cleanup();
  });

  const mockConditions = {
    title: "",
    modality: "",
    mapsLink: "",
    contractType: "",
    category: "",
    vacancyCount: "",
    salary: "",
    languages: "",
  } as unknown as VacancyConditions;

  it('renderiza el formulario y sus elementos principales', () => {
    const { container } = render(
      <InformationStep 
        conditions={mockConditions} 
        updateField={vi.fn()} 
        selectModality={vi.fn()} 
      />
    );
    expect(container).toBeTruthy();
  });

  it('permite interactuar con todos los inputs y funciones del componente', () => {
    const updateFieldMock = vi.fn();
    const selectModalityMock = vi.fn();

    render(
      <InformationStep 
        conditions={mockConditions} 
        updateField={updateFieldMock} 
        selectModality={selectModalityMock} 
      />
    );

    const remotoBtns = screen.getAllByRole('button', { name: 'Remoto' });
    fireEvent.click(remotoBtns[0]);
    expect(selectModalityMock).toHaveBeenCalledWith('Remoto');

    fireEvent.change(screen.getByLabelText(/Titulo del puesto/i), { target: { value: 'Backend' } });
    fireEvent.change(screen.getByLabelText(/Enlace de Google Maps/i), { target: { value: 'maps.com' } });
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: 'Tecnologia' } });
    fireEvent.change(screen.getByLabelText(/Numero de vacantes/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Salario/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText(/Idiomas/i), { target: { value: 'Ingles' } });

    expect(updateFieldMock).toHaveBeenCalledTimes(6);
  });
});
