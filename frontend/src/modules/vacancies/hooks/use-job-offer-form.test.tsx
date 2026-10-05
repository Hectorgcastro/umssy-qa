import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useJobOfferForm } from './use-job-offer-form';

describe('useJobOfferForm', () => {
  it('inicializa los estados del formulario sin errores', () => {
    // renderHook ejecuta tu custom hook en un entorno virtual seguro
    const { result } = renderHook(() => useJobOfferForm());
    
    // Solo verificamos que el hook se haya ejecutado y devuelva sus datos
    expect(result.current).toBeDefined();
  });
});
