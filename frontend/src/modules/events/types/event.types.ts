// Subconjunto del DTO EventItemResponse del backend utilizado por el modulo.
export interface EventCategoryItem {
  id: string;
  name: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategoryItem;
  description: string | null;
  instructorName: string | null;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string | null;
  capacity: number | null;
  availableSpots: number | null;
  registrationCount: number;
  statusId: string;
  modalityId: string;
}

export interface EventsListResponse {
  data: EventItem[];
  page: number;
  offset: number;
}

export interface GetEventsParams {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
}

// Contrato de propiedades con sufijo obligatorio Props (Estandar 2.2)
export interface EventCardProps {
  event: EventItem;
  isSelected?: boolean;
  onSelect?: (event: EventItem) => void;
}