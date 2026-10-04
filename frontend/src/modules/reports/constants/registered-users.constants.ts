import type { UserDocumentType, UserType } from "../types/registered-user.types";

export const USER_TYPE_LABELS: Record<UserType, string> = {
  STUDENT: "Estudiante",
  GRADUATE: "Egresado",
  DEGREE_HOLDER: "Titulado",
  MENTOR: "Mentor",
  COMPANY: "Empresa",
  ADMIN: "Administrador",
};

// Opciones del filtro "Tipo de usuario", en el orden en que se muestran.
export const USER_TYPE_FILTER_OPTIONS: UserType[] = ["STUDENT", "GRADUATE", "DEGREE_HOLDER", "MENTOR", "COMPANY", "ADMIN"];

export const USER_DOCUMENT_LABELS: Record<UserDocumentType, string> = {
  ACADEMIC_DEGREE: "Título académico",
  NATIONAL_DEGREE: "Título en provisión nacional",
  GRADUATION_CERTIFICATE: "Certificado de egreso",
  ACADEMIC_DIPLOMA: "Diploma académico",
  ENROLLMENT_CERTIFICATE: "Certificado de inscripción",
  NIT: "NIT",
};
