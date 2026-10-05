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

export interface RegisteredUsersParams {
  page: number;
  limit: number;
  userType?: UserType;
  // Gestión académica: "1-2025" (enero a junio) o "2-2025" (julio a diciembre).
  period?: string;
}

export type RegisteredUsersExportParams = Pick<RegisteredUsersParams, "userType" | "period">;

export interface ExportedFile {
  file: Blob;
  fileName: string;
}
