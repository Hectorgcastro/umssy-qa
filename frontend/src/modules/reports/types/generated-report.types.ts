export type ReportType = "REGISTERED_USERS" | "DEGREE_HOLDERS" | "REJECTED_USERS";

export interface GeneratedReport {
  id: string;
  fileName: string;
  reportType: ReportType;
  generatedAt: string;
}

export interface ReportHistoryParams {
  page: number;
  limit: number;
}
