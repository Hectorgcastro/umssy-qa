import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useJobOfferForm } from './use-job-offer-form';

describe('useJobOfferForm', () => {
  it('inicializa los estados del formulario sin errores', () => {
    
    const { result } = renderHook(() => useJobOfferForm());
    
    
    expect(result.current).toBeDefined();
  });
});
