import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEvents } from '../hooks/use-events';
import type { EventItem } from '../types/event.types';
import { EventsView } from './events-view';

vi.mock('../hooks/use-events', () => ({
  useEvents: vi.fn(),
}));

const MOCK_EVENTS: EventItem[] = [
  {
    id: 'e1a2b3c4-0001-4000-8000-000000000001',
    title: 'Desarrollo Web con React',
    description: 'Taller practico.',
    category: { id: 'a1a1a1a1-0001-4000-8000-000000000001', name: 'Tecnologia' },
    instructorName: 'Ing. Carlos Mendoza',
    eventDate: '2026-10-15',
    startTime: '09:00',
    endTime: '13:00',
    location: 'Auditorio FCyT',
    capacity: 30,
    availableSpots: 6,
    registrationCount: 24,
    statusId: 'b1b1b1b1-0001-4000-8000-000000000001',
    modalityId: 'c1c1c1c1-0001-4000-8000-000000000001',
  },
];

const mockUseEvents = vi.mocked(useEvents);

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  mockUseEvents.mockReturnValue({
    events: MOCK_EVENTS,
    error: null,
    hasMore: false,
    isLoading: false,
    isLoadingMore: false,
    loadMore: vi.fn(),
    retry: vi.fn(),
  });
});

describe('EventsView', () => {
  it('renderiza el encabezado principal, buscador, categorias y panel lateral', () => {
    render(<EventsView />);

    expect(
      screen.getByRole('heading', { name: /talleres disponibles/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/1 talleres cargados/i)).toBeInTheDocument();
    expect(
      screen.getByRole('search', { name: /filtros de talleres/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /selecciona un taller/i }),
    ).toBeInTheDocument();
  });

  it('muestra estado de carga y lista vacia', () => {
    mockUseEvents.mockReturnValue({
      events: [],
      error: null,
      hasMore: false,
      isLoading: true,
      isLoadingMore: false,
      loadMore: vi.fn(),
      retry: vi.fn(),
    });

    const { rerender } = render(<EventsView />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando talleres');

    mockUseEvents.mockReturnValue({
      events: [],
      error: null,
      hasMore: false,
      isLoading: false,
      isLoadingMore: false,
      loadMore: vi.fn(),
      retry: vi.fn(),
    });
    rerender(<EventsView />);

    expect(screen.getByText('No hay talleres disponibles.')).toBeInTheDocument();
  });

  it('muestra el error del backend y permite reintentar', () => {
    const retry = vi.fn();
    mockUseEvents.mockReturnValue({
      events: [],
      error: 'No se pudieron cargar los talleres.',
      hasMore: false,
      isLoading: false,
      isLoadingMore: false,
      loadMore: vi.fn(),
      retry,
    });

    render(<EventsView />);

    expect(screen.getByRole('alert')).toHaveTextContent('No se pudieron cargar');
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(retry).toHaveBeenCalledOnce();
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

  it('solicita mas eventos cuando el endpoint indica otra pagina', () => {
    const loadMore = vi.fn();
    mockUseEvents.mockReturnValue({
      events: MOCK_EVENTS,
      error: null,
      hasMore: true,
      isLoading: false,
      isLoadingMore: false,
      loadMore,
      retry: vi.fn(),
    });

    render(<EventsView />);

    fireEvent.click(screen.getByRole('button', { name: 'Cargar más talleres' }));
    expect(loadMore).toHaveBeenCalledOnce();
  });
});

const firstEvent: EventItem = {
  id: 'event-react',
  title: 'Taller de React',
  category: { id: 'technology', name: 'Tecnología' },
  description: 'Construcción de interfaces con React.',
  instructorName: 'Instructor React',
  eventDate: '2026-10-15',
  startTime: '09:00',
  endTime: '12:00',
  location: 'Aula React',
  capacity: 30,
  availableSpots: 20,
  registrationCount: 10,
  statusId: 'published',
  modalityId: 'in-person',
};

const secondEvent: EventItem = {
  ...firstEvent,
  id: 'event-prisma',
  title: 'Taller de Prisma',
  description: 'Consultas de bases de datos con Prisma.',
  instructorName: 'Instructor Prisma',
  location: 'Aula Prisma',
};

function mockEvents(events: EventItem[]) {
  vi.mocked(useEvents).mockReturnValue({
    events,
    error: null,
    hasMore: false,
    isLoading: false,
    isLoadingMore: false,
    loadMore: vi.fn(),
    retry: vi.fn(),
  });
}

describe('Selección de taller en EventsView', () => {
  beforeEach(() => {
    mockEvents([firstEvent, secondEvent]);
  });
  it('muestra la indicación de selección antes de abrir un detalle', () => {
    render(<EventsView />);

    expect(screen.getByRole('heading', { name: 'Selecciona un taller' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Taller de React/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByRole('complementary', { name: 'Detalle de Taller de React' })).not.toBeInTheDocument();
  });

  it('abre el detalle correspondiente al ID de la tarjeta seleccionada', () => {
    render(<EventsView />);

    const card = screen.getByRole('button', { name: /Taller de React/ });
    fireEvent.click(card);

    const panel = screen.getByRole('complementary', { name: 'Detalle de Taller de React' });
    expect(within(panel).getByText(firstEvent.description!)).toBeInTheDocument();
    expect(within(panel).getByText(firstEvent.location!)).toBeInTheDocument();
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('Selecciona un taller')).not.toBeInTheDocument();
  });

  it('reemplaza el detalle anterior al seleccionar otro ID', () => {
    render(<EventsView />);

    const firstCard = screen.getByRole('button', { name: /Taller de React/ });
    const secondCard = screen.getByRole('button', { name: /Taller de Prisma/ });
    fireEvent.click(firstCard);
    fireEvent.click(secondCard);

    const panel = screen.getByRole('complementary', { name: 'Detalle de Taller de Prisma' });
    expect(within(panel).getByText(secondEvent.description!)).toBeInTheDocument();
    expect(within(panel).getByText(secondEvent.instructorName!)).toBeInTheDocument();
    expect(screen.queryByText(firstEvent.description!)).not.toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'Detalle de Taller de React' })).not.toBeInTheDocument();
    expect(firstCard).toHaveAttribute('aria-pressed', 'false');
    expect(secondCard).toHaveAttribute('aria-pressed', 'true');
  });

  it.each(['Enter', ' '])('permite abrir el detalle con la tecla %s', (key) => {
    render(<EventsView />);

    fireEvent.keyDown(screen.getByRole('button', { name: /Taller de Prisma/ }), { key });

    expect(screen.getByRole('complementary', { name: 'Detalle de Taller de Prisma' })).toBeInTheDocument();
  });

  it('deja de mostrar un detalle cuyo ID desapareció del listado', () => {
    const { rerender } = render(<EventsView />);
    fireEvent.click(screen.getByRole('button', { name: /Taller de React/ }));

    mockEvents([secondEvent]);
    rerender(<EventsView />);

    expect(screen.queryByText(firstEvent.description!)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Selecciona un taller' })).toBeInTheDocument();
  });
});
