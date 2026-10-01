export const REPORT_USER_TYPES = ['graduate', 'student', 'company', 'admin'] as const;

export type ReportUserType = (typeof REPORT_USER_TYPES)[number];

export type ReportRegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface ReportUser {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly userType: ReportUserType;
  readonly identifier: string | null;
  readonly document: string | null;
  readonly registeredAt: string;
  readonly registrationStatus: ReportRegistrationStatus;
  readonly rejectionReason: string | null;
}
