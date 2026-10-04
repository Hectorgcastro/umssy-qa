"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { PassCard } from '../components/pass-card';
import { PassDetail } from '../components/pass-detail';
import { MyPassesEmptyState } from '../components/my-passes-empty-state';
import { registrationsService } from '../services/registrations.service';
import { formatRegistrationDate, type Registration } from '../types/registration.types';

export function MyPassesView() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    registrationsService.getMine(controller.signal).then((items) => {
      if (controller.signal.aborted) return;
      setRegistrations(items);
    }).catch((cause: unknown) => {
      if (controller.signal.aborted) return;
      setError(axios.isAxiosError(cause) && cause.response?.status === 401
        ? 'La sesión ha expirado. Inicia sesión nuevamente.'
        : cause instanceof Error && !axios.isAxiosError(cause)
          ? cause.message : 'No se pudieron cargar tus inscripciones. Inténtalo nuevamente.');
    }).finally(() => {
      if (!controller.signal.aborted) setIsLoading(false);
    });
    return () => controller.abort();
  }, [reload]);

  const selected = registrations.find((item) => item.id === selectedId) ?? registrations[0];

  return (
    <div className="flex flex-col lg:flex-row h-full w-full min-h-screen bg-transparent">
      <div className="flex-1 p-8 pt-4 lg:p-12 lg:pt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-ink mb-1">Mis Inscripciones</h1>
          <p className="text-text-secondary text-sm">{registrations.length} {registrations.length === 1 ? 'pase' : 'pases'}</p>
        </div>
        {isLoading ? <p role="status">Cargando tus inscripciones...</p> : error ? (
          <div role="alert" className="space-y-3">
            <p>{error}</p>
            <Link href="/login?next=/events/my-passes" className="underline mr-4">Iniciar sesión</Link>
            <button onClick={() => { setError(null); setIsLoading(true); setReload((value) => value + 1); }}>Reintentar</button>
          </div>
        ) : registrations.length === 0 ? (
          <MyPassesEmptyState />
        ) : (
          <div className="max-w-md space-y-4">
            {registrations.map((item) => <PassCard key={item.id} title={item.eventName}
              date={formatRegistrationDate(item.date)} status={item.status}
              isSelected={selected?.id === item.id} onClick={() => setSelectedId(item.id)} />)}
          </div>
        )}
      </div>
      {!isLoading && !error && selected && (
        <div className="w-full lg:w-[480px] border-l border-border bg-surface-soft/30 p-8 pt-4 lg:p-12 lg:pt-6 shrink-0">
          <PassDetail registration={selected} />
        </div>
      )}
    </div>
  );
}
