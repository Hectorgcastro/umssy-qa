export type AvailabilityBlockState = 'free' | 'pending' | 'confirmed';

export interface AvailabilityBlockResponse {
  id: string;
  mentorId: string;
  startAt: Date;
  endAt: Date;
  state: AvailabilityBlockState;
  createdAt: Date;
  updatedAt: Date;
}
