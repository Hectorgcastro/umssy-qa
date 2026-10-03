export interface EventCategoryResponse {
  id: string;
  name: string;
}

export interface EventItemResponse {
  id: string;
  title: string;
  description: string | null;
  category: EventCategoryResponse;
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
  data: EventItemResponse[];
  page: number;
  offset: number;
}

export interface EventRawRecord {
  id: string;
  title: string;
  description: string | null;
  categoryId: string;
  instructorName: string | null;
  eventDate: Date;
  startTime: Date;
  endTime: Date;
  location: string | null;
  capacity: number | null;
  statusId: string;
  modalityId: string;
  category: {
    id: string;
    name: string;
  };
  _count: {
    registrations: number;
  };
}
