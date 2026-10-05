import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEvents } from '../hooks/use-events';
import { useEventsFilters } from '../hooks/use-events-filters';
import { useEventCategories } from '../hooks/use-event-categories';
import type { EventItem } from '../types/event.types';
import { EventsView } from './events-view';

vi.mock('../hooks/use-events', () => ({
  useEvents: vi.fn(),
}));
vi.mock('../hooks/use-events-filters', () => ({
  useEventsFilters: vi.fn(),
}));
vi.mock('../hooks/use-event-categories', () => ({
  useEventCategories: vi.fn(),
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
const mockUseEventsFilters = vi.mocked(useEventsFilters);
const mockUseEventCategories = vi.mocked(useEventCategories);

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  mockUseEventsFilters.mockReturnValue({
    searchInput: '',
    setSearchInput: vi.fn(),
    categoryId: null,
    setCategoryId: vi.fn(),
    filters: { search: '', categoryId: null },
  });
  mockUseEventCategories.mockReturnValue({
    categories: [{ id: 'cat-1', name: 'Tecnología' }],
    isLoading: false,
    error: null,
  });
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

  it('conecta la búsqueda y las categorías con los filtros de eventos', () => {
    render(<EventsView />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar taller' }), {
      target: { value: 'Prisma' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Tecnología' }));

    const filterState = mockUseEventsFilters.mock.results[0].value;
    expect(filterState.setSearchInput).toHaveBeenCalledWith('Prisma');
    expect(filterState.setCategoryId).toHaveBeenCalledWith('cat-1');
    expect(mockUseEvents).toHaveBeenCalledWith(filterState.filters);
  });
});