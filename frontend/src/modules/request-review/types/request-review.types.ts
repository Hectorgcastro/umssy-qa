export type ReviewStatus = "pending" | "in_review" | "approved" | "rejected";

export interface ReviewListItem {
  id: string;
  requestCode: string | null;
  fullName: string;
  email: string;
  sisCode: string;
  documentType: string | null;
  submittedAt: string | null;
  status: ReviewStatus;
}

export interface ReviewListResult {
  items: ReviewListItem[];
  total: number;
  page: number;
  offset: number;
}

export type ReviewApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };
