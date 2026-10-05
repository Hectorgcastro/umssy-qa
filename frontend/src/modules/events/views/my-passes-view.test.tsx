import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registrationsService } from '../services/registrations.service';
import { MyPassesView } from './my-passes-view';

vi.mock('../services/registrations.service', () => ({ registrationsService: { getMine: vi.fn() } }));
const getMine = vi.mocked(registrationsService.getMine);
const pass = { id: 'reg-1', eventName: 'React', date: '2026-10-20T00:00:00Z', startTime: '1970-01-01T09:00:00Z', endTime: '1970-01-01T12:00:00Z', location: 'Aula 101', status: 'Confirmada' };
beforeEach(() => { getMine.mockReset(); });
afterEach(cleanup);

describe('Mis pases', () => {
  it('muestra carga, datos reales y cambia el detalle al seleccionar otra inscripción', async () => {
    getMine.mockResolvedValue([pass, { ...pass, id: 'reg-2', eventName: 'Prisma', location: 'Lab 2' }]);
    render(<MyPassesView />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando');
    expect(screen.queryByRole('region', { name: 'Aún no tienes inscripciones.' })).not.toBeInTheDocument();
    await screen.findByText('reg-1');
    expect(screen.getByText('Aula 101')).toBeInTheDocument();
    expect(screen.getByText(/09:00 - 12:00/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Prisma/ }));
    expect(screen.getByText('reg-2')).toBeInTheDocument();
    expect(screen.getByText('Lab 2')).toBeInTheDocument();
    expect(screen.queryByText('reg-1')).not.toBeInTheDocument();
  });
  it('muestra el estado vacío y acceso al catálogo', async () => {
    getMine.mockResolvedValue([]);
    render(<MyPassesView />);
    expect(await screen.findByRole('region', { name: 'Aún no tienes inscripciones.' })).toBeInTheDocument();
    expect(screen.getByText('0 pases')).toBeInTheDocument();
    expect(screen.queryByText('ID Inscripción')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Vista ilustrativa de QR')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explorar talleres disponibles' })).toHaveAttribute('href', '/events');
  });
  it('permite reintentar y muestra un único pase después de recuperarse', async () => {
    getMine.mockRejectedValueOnce(new Error('Debes iniciar sesión')).mockResolvedValueOnce([pass]);
    render(<MyPassesView />);
    await screen.findByRole('alert');
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login?next=/events/my-passes');
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    await screen.findByText('reg-1');
    expect(screen.getByText('1 pase')).toBeInTheDocument();
    expect(getMine).toHaveBeenCalledTimes(2);
  });
  it.each([
    [{ isAxiosError: true, response: { status: 401 } }, 'La sesión ha expirado'],
    [{ isAxiosError: true, response: { status: 500 } }, 'No se pudieron cargar'],
    [{ isAxiosError: true }, 'No se pudieron cargar'],
    ['unknown', 'No se pudieron cargar'],
  ])('presenta el error apropiado: %s', async (cause, message) => {
    getMine.mockRejectedValue(cause);
    render(<MyPassesView />);
    expect(await screen.findByRole('alert')).toHaveTextContent(message);
    expect(screen.queryByRole('region', { name: 'Aún no tienes inscripciones.' })).not.toBeInTheDocument();
    expect(screen.queryByText('ID Inscripción')).not.toBeInTheDocument();
  });
  it.each([true, false])('cancela la consulta al desmontar sin actualizar la vista: %s', async (success) => {
    let resolve!: (items: typeof pass[]) => void;
    let reject!: (cause: unknown) => void;
    getMine.mockReturnValue(new Promise((res, rej) => { resolve = res; reject = rej; }));
    const { unmount } = render(<MyPassesView />);
    const signal = getMine.mock.calls[0][0];
    unmount();
    expect(signal?.aborted).toBe(true);
    await act(async () => { if (success) resolve([pass]); else reject(new Error('cancelled')); });
    await waitFor(() => expect(screen.queryByText('React')).not.toBeInTheDocument());
  });
});
