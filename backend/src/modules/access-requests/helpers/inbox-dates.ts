import { BOLIVIA_OFFSET_MS, DAY_MS } from '../../../common/constants/date-time.constants.js';

// Instante UTC en que empieza el día de Bolivia que contiene a `now`
export function startOfBoliviaDay(now: Date): Date {
  const shifted = now.getTime() + BOLIVIA_OFFSET_MS;
  return new Date(Math.floor(shifted / DAY_MS) * DAY_MS - BOLIVIA_OFFSET_MS);
}

// Instante UTC en que empieza el mes de Bolivia que contiene a `now`
export function startOfBoliviaMonth(now: Date): Date {
  const shifted = new Date(now.getTime() + BOLIVIA_OFFSET_MS);
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), 1) - BOLIVIA_OFFSET_MS);
}
