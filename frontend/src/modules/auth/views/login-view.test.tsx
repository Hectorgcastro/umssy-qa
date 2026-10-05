import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LoginView } from './login-view'; // <-- ¡Aquí estaba el detalle!

// Simulamos (mock) el router de Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('LoginView', () => {
  it('renderiza la vista de inicio de sesión sin errores', () => {
    // Dibujamos el componente en un entorno virtual
    const { container } = render(<LoginView />);
    
    // Verificamos que el componente exista y se haya renderizado en pantalla
    expect(container).toBeTruthy();
    expect(container.firstChild).not.toBeNull();
  });
});
