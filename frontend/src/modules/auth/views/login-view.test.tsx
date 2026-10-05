import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useLogin } from '../hooks/use-login';
import { LoginView } from './login-view';

const { push, login } = vi.hoisted(() => ({ push: vi.fn(), login: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('../hooks/use-login', () => ({ useLogin: vi.fn() }));
beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  login.mockResolvedValue({ accessToken: 'session-token', roleTag: 'titulado' });
  vi.mocked(useLogin).mockReturnValue({ login, isLoading: false, error: null });
});
afterEach(() => { cleanup(); window.history.replaceState({}, '', '/'); });

describe('retorno después del login', () => {
  it.each([
    ['/login?next=/events/my-passes', '/events/my-passes'],
    ['/login', '/'],
    ['/login?next=https://example.com', '/'],
    ['/login?next=//example.com', '/'],
  ])('desde %s redirige a %s', async (url, destination) => {
    window.history.replaceState({}, '', url);
    render(<LoginView />);
    fireEvent.change(screen.getByPlaceholderText('nombre@ejemplo.com'), { target: { value: 'prueba@umss.edu.bo' } });
    fireEvent.change(screen.getByPlaceholderText('********'), { target: { value: 'Prueba123' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Iniciar sesión' }).closest('form')!);
    await waitFor(() => expect(push).toHaveBeenCalledWith(destination));
    expect(sessionStorage.getItem('accessToken')).toBe('session-token');
    expect(login).toHaveBeenCalledWith({ email: 'prueba@umss.edu.bo', password: 'Prueba123', roleTag: 'titulado' });
  });
  it('permanece en el login si la autenticación falla', async () => {
    login.mockResolvedValue(null);
    render(<LoginView />);
    fireEvent.submit(screen.getByRole('button', { name: 'Iniciar sesión' }).closest('form')!);
    await waitFor(() => expect(login).toHaveBeenCalledOnce());
    expect(push).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('accessToken')).toBeNull();
  });
});
