'use client';

import { useEffect, useState } from 'react';
import { eventCategoriesService } from '../services/event-categories.service';
import type { EventCategoryItem } from '../types/event.types';

const ERROR_MESSAGE = 'No se pudieron cargar las categorías.';

interface CategoriesResult {
  categories: EventCategoryItem[];
  error: string | null;
}

export function useEventCategories() {
  const [result, setResult] =
    useState<CategoriesResult | null>(null);

  useEffect(() => {
    let isCancelled = false;

    eventCategoriesService
      .getAll()
      .then((categories) => {
        if (!isCancelled) {
          setResult({
            categories,
            error: null,
          });
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setResult({
            categories: [],
            error: ERROR_MESSAGE,
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    categories: result?.categories ?? [],
    isLoading: result === null,
    error: result?.error ?? null,
  };
}