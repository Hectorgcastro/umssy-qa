export interface AvailabilityBlock {
  id: string;
  mentorId: string;
  startAt: string;
  endAt: string;
  seriesId?: string;
  repeatUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityBlockInput {
  mentorId: string;
  startAt: string;
  endAt: string;
  seriesId?: string;
  repeatUntil?: string;
}

export interface AvailabilityFilters {
  mentorId?: string;
  startAt?: string;
  endAt?: string;
}
