import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InformationStep } from './information-step';

describe('InformationStep', () => {
  // 1. Preparamos datos simulados vacíos para que el componente no se rompa al leerlos
  const mockConditions = {
    title: "",
    modality: "",
    mapsLink: "",
    contractType: "",
    category: "",
    vacancyCount: "",
    salary: "",
    languages: "",
  };

  it('renderiza el formulario y sus elementos principales', () => {
    const { container } = render(
      <InformationStep 
        conditions={mockConditions as any} 
        updateField={vi.fn()} 
        selectModality={vi.fn()} 
      />
    );
    expect(container).toBeTruthy();
    expect(screen.getByText('Informacion y condiciones de la oferta')).toBeTruthy();
  });

  it('permite interactuar con los inputs y botones de modalidad', () => {
    // 2. Creamos "espías" (funciones falsas) para ver si el componente las llama
    const updateFieldMock = vi.fn();
    const selectModalityMock = vi.fn();

    render(
      <InformationStep 
        conditions={mockConditions as any} 
        updateField={updateFieldMock} 
        selectModality={selectModalityMock} 
      />
    );

    // 3. Simulamos que el usuario hace clic en el botón "Remoto"
    const remotoBtn = screen.getByRole('button', { name: 'Remoto' });
    fireEvent.click(remotoBtn);
    expect(selectModalityMock).toHaveBeenCalledWith('Remoto');

    // 4. Simulamos que el usuario escribe en el input del título
    const tituloInput = screen.getByLabelText(/Titulo del puesto/i);
    fireEvent.change(tituloInput, { target: { value: 'Backend' } });
    expect(updateFieldMock).toHaveBeenCalledWith('title', 'Backend');
  });
});
