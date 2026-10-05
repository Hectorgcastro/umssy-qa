import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InformationStep } from './information-step';
import { VacancyConditions } from '../hooks/use-job-offer-form';

describe('InformationStep', () => {
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
    expect(screen.getByText('Informacion y condiciones de la oferta')).toBeTruthy();
  });

  it('permite interactuar con los inputs y botones de modalidad', () => {
    const updateFieldMock = vi.fn();
    const selectModalityMock = vi.fn();

    render(
      <InformationStep 
        conditions={mockConditions} 
        updateField={updateFieldMock} 
        selectModality={selectModalityMock} 
      />
    );

    // Usamos getAllByRole y seleccionamos el primer botón del arreglo [0]
    const remotoBtns = screen.getAllByRole('button', { name: 'Remoto' });
    fireEvent.click(remotoBtns[0]);
    expect(selectModalityMock).toHaveBeenCalledWith('Remoto');

    const tituloInput = screen.getByLabelText(/Titulo del puesto/i);
    fireEvent.change(tituloInput, { target: { value: 'Backend' } });
    expect(updateFieldMock).toHaveBeenCalledWith('title', 'Backend');
  });
});
