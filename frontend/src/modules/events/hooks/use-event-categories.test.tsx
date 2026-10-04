import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useEventCategories } from './use-event-categories';
import { eventCategoriesService } from '../services/event-categories.service';

vi.mock('../services/event-categories.service', () => ({
  eventCategoriesService: {
    getAll: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('useEventCategories', () => {
  it('loads categories successfully', async () => {
    vi.mocked(eventCategoriesService.getAll).mockResolvedValue([
      {
        id: 'category-1',
        name: 'Tecnología',
      },
      {
        id: 'category-2',
        name: 'IA & Datos',
      },
    ]);

    const { result } = renderHook(() => useEventCategories());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('returns an error when categories cannot be loaded', async () => {
    vi.mocked(eventCategoriesService.getAll).mockRejectedValue(
      new Error('Request failed'),
    );

    const { result } = renderHook(() => useEventCategories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBe(
      'No se pudieron cargar las categorías.',
    );
  });
});