import type { ReviewStatus } from "../types/request-review.types";

export const REVIEW_PAGE_SIZE = 10;

export const REVIEW_TABS: ReadonlyArray<{ value: ReviewStatus; label: string }> = [
  { value: "pending", label: "Pendientes" },
  { value: "in_review", label: "En revisión" },
  { value: "approved", label: "Aprobadas" },
  { value: "rejected", label: "Rechazadas" },
];

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "Pendiente",
  in_review: "En revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  academic_diploma: "Diploma académico",
  national_title: "Título en provisión nacional",
};

export const BACKOFFICE_ROLE = "administrativo";
export const SESSION_TOKEN_KEY = "accessToken";
export const LOGIN_PATH = "/login";
export const INBOX_PATH = "/backoffice/solicitudes";
