import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import EventsPage from '@/app/(app)/events/page';
import AppLayout from '@/app/(app)/layout';
import { EventsView } from './events-view';

// Simulacion requerida por el nuevo hook use-mobile.ts de shadcn sidebar en entorno jsdom
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

vi.mock('next/navigation', () => ({
  usePathname: () => '/events',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
});

describe('Tarea 1 - Layout y Vista de Talleres Disponibles', () => {
  it('renderiza EventsView con el encabezado principal, filtros y resumen de talleres', () => {
    render(<EventsView />);

    expect(
      screen.getByRole('heading', { name: /talleres disponibles/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/6 talleres/i)).toBeInTheDocument();
    expect(
      screen.getByRole('search', { name: /filtros de talleres/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(
      within(screen.getByRole('search', { name: /filtros de talleres/i })).getByText('IA & Datos'),
    ).toBeInTheDocument();
  });

  it('renderiza las tarjetas con ambos estados de cupo y el panel lateral derecho', () => {
    render(<EventsView />);

    const workshopList = screen.getByRole('region', { name: /listado de talleres/i });

    expect(within(workshopList).getByText('Desarrollo Web con React')).toBeInTheDocument();
    expect(within(workshopList).getByText('Diseno UI/UX para Moviles')).toBeInTheDocument();
    expect(screen.getByText('Lleno')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /selecciona un taller/i }),
    ).toBeInTheDocument();
  });

  it('integra correctamente el Server Component EventsPage dentro del layout de (app)', () => {
    const { container } = render(
      <AppLayout>
        <EventsPage />
      </AppLayout>,
    );

    expect(
      within(container).getByRole('heading', { name: /talleres disponibles/i }),
    ).toBeInTheDocument();
    expect(within(container).getByRole('link', { name: 'Talleres' })).toHaveAttribute('href', '/events');
  });
});