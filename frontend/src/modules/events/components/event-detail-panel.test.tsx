import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/shared/services/api-client';
import type { EventItem } from '../types/event.types';
import { EventDetailPanel } from './event-detail-panel';

const eventWithSpots: EventItem = {
  id: 'event-with-spots',
  title: 'Taller de React',
  category: { id: 'technology', name: 'Tecnología' },
  description: 'Interfaces con React.',
  instructorName: 'Instructor React',
  eventDate: '2026-10-20',
  startTime: '09:00',
  endTime: '12:00',
  location: 'Aula 101',
  capacity: 30,
  availableSpots: 5,
  registrationCount: 25,
  statusId: 'published',
  modalityId: 'in-person',
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Estado de Inscribirme según el cupo', () => {
  it('habilita el botón con los cupos del taller mostrado', () => {
    render(<EventDetailPanel event={eventWithSpots} />);

    expect(screen.getByRole('button', { name: 'Inscribirme' })).toBeEnabled();
    expect(screen.getByText('5 cupos disponibles')).toBeInTheDocument();
    expect(screen.getByText('25 de 30')).toBeInTheDocument();
  });

  it.each([
    { capacity: 30, registrationCount: 30, availableSpots: 0 },
    { capacity: 30, registrationCount: 35, availableSpots: 0 },
    { capacity: 0, registrationCount: 0, availableSpots: 0 },
  ])('deshabilita la inscripción cuando no quedan cupos: %j', (capacityData) => {
    render(<EventDetailPanel event={{ ...eventWithSpots, ...capacityData }} />);

    expect(screen.getByRole('button', { name: 'Inscribirme' })).toBeDisabled();
    expect(screen.getByText('No hay cupos disponibles.')).toBeInTheDocument();
  });

  it('interpreta el contrato de capacidad nula como sin límite', () => {
    render(<EventDetailPanel event={{ ...eventWithSpots, capacity: null, availableSpots: null }} />);

    expect(screen.getByRole('button', { name: 'Inscribirme' })).toBeEnabled();
    expect(screen.getByText('Sin límite de cupos')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it.each([
    ['cupos nulos con capacidad finita', { availableSpots: null }],
    ['cupos ausentes', { availableSpots: undefined }],
    ['capacidad ausente', { capacity: undefined }],
    ['capacidad negativa', { capacity: -1 }],
    ['capacidad infinita', { capacity: Infinity }],
    ['cupos negativos', { availableSpots: -1 }],
    ['cupos no numéricos', { availableSpots: '5' }],
    ['cupos NaN', { availableSpots: NaN }],
    ['cupos fraccionarios', { availableSpots: 0.5 }],
    ['conteo ausente', { registrationCount: undefined }],
    ['conteo negativo', { registrationCount: -1 }],
    ['datos inconsistentes', { registrationCount: 30, availableSpots: 5 }],
    ['capacidad sin límite con cupos numéricos', { capacity: null }],
  ])('bloquea el botón con información inválida: %s', (_, invalidData) => {
    const event = { ...eventWithSpots, ...invalidData } as EventItem;
    render(<EventDetailPanel event={event} />);

    expect(screen.getByRole('button', { name: 'Inscribirme' })).toBeDisabled();
    expect(screen.getByText('Información de cupos no disponible.')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('actualiza el botón al cambiar entre talleres disponibles, llenos y sin información', () => {
    const { rerender } = render(<EventDetailPanel event={eventWithSpots} />);
    expect(screen.getByRole('button', { name: 'Inscribirme' })).toBeEnabled();

    rerender(<EventDetailPanel event={{ ...eventWithSpots, id: 'event-full', availableSpots: 0, registrationCount: 30 }} />);
    expect(screen.getByRole('button', { name: 'Inscribirme' })).toBeDisabled();
    expect(screen.getByText('No hay cupos disponibles.')).toBeInTheDocument();

    rerender(<EventDetailPanel event={{ ...eventWithSpots, id: 'event-unknown', availableSpots: null }} />);
    expect(screen.getByRole('button', { name: 'Inscribirme' })).toBeDisabled();
    expect(screen.getByText('Información de cupos no disponible.')).toBeInTheDocument();

    rerender(<EventDetailPanel event={eventWithSpots} />);
    expect(screen.getByRole('button', { name: 'Inscribirme' })).toBeEnabled();
    expect(screen.getByText('5 cupos disponibles')).toBeInTheDocument();
  });

  it('al pulsar el botón habilitado no envía una inscripción ni un formulario', () => {
    const post = vi.spyOn(apiClient, 'post');
    const fetch = vi.fn();
    const submit = vi.fn();
    vi.stubGlobal('fetch', fetch);

    render(<form onSubmit={submit}><EventDetailPanel event={eventWithSpots} /></form>);
    fireEvent.click(screen.getByRole('button', { name: 'Inscribirme' }));

    expect(post).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });
});
