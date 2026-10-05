import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useJobOfferForm } from './use-job-offer-form';

describe('useJobOfferForm', () => {
  it('inicializa con el paso 1 y condiciones vacías', () => {
    const { result } = renderHook(() => useJobOfferForm());
    expect(result.current.currentStep).toBe(1);
    expect(result.current.conditions.title).toBe("");
  });

  it('actualiza un campo de texto correctamente', () => {
    const { result } = renderHook(() => useJobOfferForm());
    act(() => {
      result.current.updateField('title', 'Desarrollador React');
    });
    expect(result.current.conditions.title).toBe('Desarrollador React');
  });

  it('selecciona la modalidad correctamente', () => {
    const { result } = renderHook(() => useJobOfferForm());
    act(() => {
      result.current.selectModality('Remoto');
    });
    expect(result.current.conditions.modality).toBe('Remoto');
  });

  it('avanza de paso sin superar el límite de 3', () => {
    const { result } = renderHook(() => useJobOfferForm());
    
    act(() => { result.current.goNext(); });
    expect(result.current.currentStep).toBe(2);
    
    act(() => { result.current.goNext(); });
    expect(result.current.currentStep).toBe(3);

    act(() => { result.current.goNext(); });
    expect(result.current.currentStep).toBe(3);
  });
});
