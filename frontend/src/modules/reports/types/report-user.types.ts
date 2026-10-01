export interface ReportUser {
  id: string;
  fullName: string;
  email: string;
  userType: string;
  identifier: string | null;
  document: string | null;
  registeredAt: string;
  registrationStatus: string;
  rejectionReason: string | null;
}

export interface BaseReportFilters {
  page: number;
  limit: number;
  search: string;
}

export interface RegisteredUsersFilters extends BaseReportFilters {
  userType: string;
  year: number;
}

export type RejectedUsersFilters = BaseReportFilters;
