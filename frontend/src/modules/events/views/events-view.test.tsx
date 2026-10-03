import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EventsView } from './events-view';

afterEach(() => {
  cleanup();
});

describe('EventsView', () => {
  it('renderiza el encabezado principal, buscador, categorias y panel lateral', () => {
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
      screen.getByRole('heading', { name: /selecciona un taller/i }),
    ).toBeInTheDocument();
  });

  it('renderiza las tarjetas EventCard y permite seleccionar un taller al hacer clic', () => {
    render(<EventsView />);

    const workshopList = screen.getByRole('region', { name: /listado de talleres/i });
    const firstWorkshopCard = within(workshopList).getByRole('button', {
      name: /desarrollo web con react/i,
    });

    expect(firstWorkshopCard).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(firstWorkshopCard);
    expect(firstWorkshopCard).toHaveAttribute('aria-pressed', 'true');
  });
});