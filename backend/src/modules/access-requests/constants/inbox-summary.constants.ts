import { ACCESS_REQUEST_STATUS } from '../types/access-request.enum.js';

// Los límites de "hoy" y "este mes" se calculan con el desfase fijo de Bolivia (sin horario de verano)
export const INBOX_TIME_ZONE = 'America/La_Paz';

export const PENDING_ALERT_HOURS = 24;
export const REVIEW_TIME_WINDOW_DAYS = 30;
export const REVIEW_TIME_GOAL_HOURS = 48;

export const HOUR_MS = 60 * 60 * 1000;

export const DECIDED_STATUSES: string[] = [ACCESS_REQUEST_STATUS.APPROVED, ACCESS_REQUEST_STATUS.REJECTED];
