import type { UserDocumentType } from "./registered-user.types";

export interface RejectedUser {
  id: string;
  fullName: string;
  email: string;
  identifier: string;
  documentType: UserDocumentType;
  registeredAt: string;
}

export interface RejectedUsersParams {
  page: number;
  limit: number;
  search?: string;
}
