import { toBoliviaTime } from "@/shared/utils/date-time";
import type { CreateAvailabilityBlockInput } from "../types/availability";

// Mismas reglas y mensajes que la validación de creación de bloques del backend.
// Rango de atención en hora de Bolivia (valor propuesto, a confirmar con el PO).
export const BLOCK_MIN_HOUR = 7;
export const BLOCK_MAX_HOUR = 22;
export const BLOCK_STEP_MINUTES = 30;

export const BLOCK_MESSAGES = {
  endBeforeStart: "La hora de fin debe ser posterior a la hora de inicio",
  startInPast: "La hora de inicio ya pasó",
  outOfRange: `El horario debe estar entre las ${String(BLOCK_MIN_HOUR).padStart(2, "0")}:00 y las ${String(BLOCK_MAX_HOUR).padStart(2, "0")}:00`,
  invalidStep: `Las horas deben ir en intervalos de ${BLOCK_STEP_MINUTES} minutos`,
  differentDays: "El bloque debe empezar y terminar el mismo día",
} as const;

export type BlockValidationErrors = Partial<Record<keyof CreateAvailabilityBlockInput, string>>;

const getBoliviaParts = (value: string) => {
  const date = new Date(value);
  const { date: day, hours, minutes } = toBoliviaTime(date);
  return {
    day,
    minutesOfDay: hours * 60 + minutes,
    isOnStep: minutes % BLOCK_STEP_MINUTES === 0 && date.getUTCSeconds() === 0 && date.getUTCMilliseconds() === 0,
  };
};

// Devuelve el primer error de cada campo; un objeto vacío significa que el bloque es válido.
export function validateBlock(
  { startAt, endAt }: CreateAvailabilityBlockInput,
  now: Date = new Date(),
): BlockValidationErrors {
  const errors: BlockValidationErrors = {};
  const startTime = new Date(startAt).getTime();
  const endTime = new Date(endAt).getTime();

  if (endTime <= startTime) {
    return { endAt: BLOCK_MESSAGES.endBeforeStart };
  }

  if (startTime <= now.getTime()) {
    errors.startAt = BLOCK_MESSAGES.startInPast;
  }

  const start = getBoliviaParts(startAt);
  const end = getBoliviaParts(endAt);

  if (!start.isOnStep) errors.startAt ??= BLOCK_MESSAGES.invalidStep;
  if (!end.isOnStep) errors.endAt ??= BLOCK_MESSAGES.invalidStep;

  // 22:00 del mismo día es válido como fin; 00:00 del día siguiente no.
  if (start.day !== end.day) {
    errors.endAt ??= BLOCK_MESSAGES.differentDays;
    return errors;
  }

  if (start.minutesOfDay < BLOCK_MIN_HOUR * 60) errors.startAt ??= BLOCK_MESSAGES.outOfRange;
  if (end.minutesOfDay > BLOCK_MAX_HOUR * 60) errors.endAt ??= BLOCK_MESSAGES.outOfRange;

  return errors;
}
