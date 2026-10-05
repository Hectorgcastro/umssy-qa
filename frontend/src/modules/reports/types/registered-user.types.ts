export type UserType = "STUDENT" | "DEGREE_HOLDER" | "MENTOR" | "COMPANY" | "ADMIN";

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

// Gestión semestral: "I-2025" (enero a junio) o "II-2025" (julio a diciembre).
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
