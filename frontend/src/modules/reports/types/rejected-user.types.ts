export type RejectedDocumentStatus = "OBSERVED" | "NOT_SUBMITTED";

export interface RejectedUser {
  id: string;
  fullName: string;
  email: string;
  identifier: string;
  documentStatus: RejectedDocumentStatus;
  registeredAt: string;
}

export interface RejectedUsersParams {
  page: number;
  limit: number;
}
