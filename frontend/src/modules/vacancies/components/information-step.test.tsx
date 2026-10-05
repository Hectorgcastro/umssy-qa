import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InformationStep } from './information-step';
import type { VacancyConditions } from '../hooks/use-job-offer-form';
import React from 'react';

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: any) => (
    <div data-testid="mock-select" onClick={() => onValueChange('Tiempo completo')}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <div>{placeholder}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
}));

describe('InformationStep', () => {
  const mockUpdateField = vi.fn();
  const mockSelectModality = vi.fn();

  const emptyConditions: VacancyConditions = {
    title: "", modality: null, mapsLink: "", contractType: "",
    category: "", vacancyCount: "", salary: "", languages: "",
  };

  it('renderiza todos los campos principales', () => {
    render(
      <InformationStep 
        conditions={emptyConditions} 
        updateField={mockUpdateField} 
        selectModality={mockSelectModality} 
      />
    );
    
    expect(screen.getByText(/Título del puesto/i)).toBeInTheDocument();
    expect(screen.getByText(/Modalidad/i)).toBeInTheDocument();
    expect(screen.getByText(/Tipo de contrato/i)).toBeInTheDocument();
    expect(screen.getByText(/Número de vacantes/i)).toBeInTheDocument();
    expect(screen.getByText(/Idiomas/i)).toBeInTheDocument();
    expect(screen.getByText(/Enlace de Google Maps/i)).toBeInTheDocument();
    expect(screen.getByText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByText(/Salario/i)).toBeInTheDocument();
  });

  it('llama a selectModality al hacer clic en los botones de modalidad', () => {
    render(
      <InformationStep 
        conditions={emptyConditions} 
        updateField={mockUpdateField} 
        selectModality={mockSelectModality} 
      />
    );
    
    const remoteButton = screen.getByText('Remoto');
    fireEvent.click(remoteButton);
    expect(mockSelectModality).toHaveBeenCalledWith('Remoto');
  });

  it('llama a updateField al escribir en los inputs', () => {
    const { container } = render(
      <InformationStep 
        conditions={emptyConditions} 
        updateField={mockUpdateField} 
        selectModality={mockSelectModality} 
      />
    );
    
    const titleInput = container.querySelector('input[type="text"]');
    if (titleInput) {
      fireEvent.change(titleInput, { target: { value: 'Nuevo Título' } });

      expect(mockUpdateField).toHaveBeenCalled(); 
    }
  });
  
  it('renderiza correctamente con datos pre-cargados', () => {
     const fullConditions: VacancyConditions = {
        title: "Desarrollador Backend", modality: "Híbrido", mapsLink: "https://maps.google.com/?q=...", contractType: "Tiempo completo",
        category: "Tecnología", vacancyCount: "1", salary: "Bs 6.500 - 8.000", languages: "Español, ingles intermedio",
      };
      
      render(
        <InformationStep 
          conditions={fullConditions} 
          updateField={mockUpdateField} 
          selectModality={mockSelectModality} 
        />
      );
      
      expect(screen.getByDisplayValue("Desarrollador Backend")).toBeInTheDocument();
  });
});
