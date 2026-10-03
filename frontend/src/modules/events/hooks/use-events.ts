'use client';

import { useEffect, useState } from 'react';
import { eventsService } from '../services/events.service';
import type { EventItem } from '../types/event.types';

const EVENTS_PAGE_SIZE = 50;

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const isFirstPage = page === 1;

    eventsService
      .getEvents({ page, limit: EVENTS_PAGE_SIZE }, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;

        setEvents((currentEvents) =>
          isFirstPage ? response.data : [...currentEvents, ...response.data],
        );
        setHasMore(response.data.length === EVENTS_PAGE_SIZE);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError('No se pudieron cargar los talleres. Revisa la conexión e inténtalo de nuevo.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      });

    return () => controller.abort();
  }, [page, reloadVersion]);

  const retry = () => {
    setEvents([]);
    setHasMore(false);
    setError(null);
    setIsLoading(true);
    setIsLoadingMore(false);
    setPage(1);
    setReloadVersion((version) => version + 1);
  };

  const loadMore = () => {
    if (hasMore && !isLoading && !isLoadingMore) {
      setError(null);
      setIsLoadingMore(true);
      setPage((currentPage) => currentPage + 1);
    }
  };

  return {
    events,
    error,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    retry,
  };
}