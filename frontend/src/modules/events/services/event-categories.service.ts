import type { EventCategoryItem } from '../types/event.types';

const MOCK_EVENT_CATEGORIES: EventCategoryItem[] = [
  {
    id: '22222222-2222-2222-2222-222222222221',
    name: 'Tecnología',
  },
  {
    id: '22222222-2222-2222-2222-222222222231',
    name: 'IA & Datos',
  },
  {
    id: '22222222-2222-2222-2222-222222222232',
    name: 'Diseño',
  },
  {
    id: '22222222-2222-2222-2222-222222222233',
    name: 'Seguridad',
  },
];

export const eventCategoriesService = {
  async getAll(): Promise<EventCategoryItem[]> {
    return MOCK_EVENT_CATEGORIES;
  },
};