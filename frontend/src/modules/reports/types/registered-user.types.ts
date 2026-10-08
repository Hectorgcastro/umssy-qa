import type { PaginatedData } from "@/shared/types/api-response.types";

export type UserType = "STUDENT" | "GRADUATE" | "DEGREE_HOLDER" | "MENTOR" | "COMPANY" | "ADMIN";

export type UserDocumentType =
  | "ACADEMIC_DEGREE"
  | "NATIONAL_DEGREE"
  | "GRADUATION_CERTIFICATE"
  | "ACADEMIC_DIPLOMA"
  | "ENROLLMENT_CERTIFICATE"
  | "NIT";

export interface RegisteredUser {
  id: string;
  fullName: string;
  email: string;
  userType: UserType;
  identifier: string;
  documentType: UserDocumentType;
  registeredAt: string;
}

export type AcademicPeriod = `${"I" | "II"}-${number}`;

export interface RegisteredUsersParams {
  page: number;
  limit: number;
  userType?: UserType;
  period?: AcademicPeriod;
}

export type RegisteredUsersExportParams = Pick<RegisteredUsersParams, "userType" | "period">;

export interface ExportedFile {
  file: Blob;
  fileName: string;
}

export interface RegisteredUsersState {
  requestKey: string;
  result?: PaginatedData<RegisteredUser>;
  errorMessage?: string;
}
