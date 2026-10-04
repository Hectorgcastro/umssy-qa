import { z } from 'zod';
import { toBoliviaTime } from '../../../common/utils/date-time.js';

// Rango de atención en hora de Bolivia (valor propuesto, a confirmar con el PO).
export const BLOCK_MIN_HOUR = 7;
export const BLOCK_MAX_HOUR = 22;
export const BLOCK_STEP_MINUTES = 30;

export const CREATE_BLOCK_MESSAGES = {
  invalidDate: 'La fecha y hora no tienen un formato válido',
  endBeforeStart: 'La hora de fin debe ser posterior a la hora de inicio',
  startInPast: 'La hora de inicio ya pasó',
  outOfRange: `El horario debe estar entre las ${String(BLOCK_MIN_HOUR).padStart(2, '0')}:00 y las ${String(BLOCK_MAX_HOUR).padStart(2, '0')}:00`,
  invalidStep: `Las horas deben ir en intervalos de ${BLOCK_STEP_MINUTES} minutos`,
  differentDays: 'El bloque debe empezar y terminar el mismo día',
} as const;

const getBoliviaParts = (date: Date) => {
  const { date: day, hours, minutes } = toBoliviaTime(date);
  return {
    day,
    minutesOfDay: hours * 60 + minutes,
    isOnStep:
      minutes % BLOCK_STEP_MINUTES === 0 &&
      date.getUTCSeconds() === 0 &&
      date.getUTCMilliseconds() === 0,
  };
};

const isoDateTime = z.iso.datetime({ offset: true, error: CREATE_BLOCK_MESSAGES.invalidDate });

// Se recibe "now" para poder probar el esquema con una fecha fija.
export const buildCreateBlockSchema = (getNow: () => Date = () => new Date()) =>
  z
    .strictObject({
      startAt: isoDateTime,
      endAt: isoDateTime,
    })
    .superRefine((payload, ctx) => {
      const startAt = new Date(payload.startAt);
      const endAt = new Date(payload.endAt);

      if (endAt.getTime() <= startAt.getTime()) {
        ctx.addIssue({
          code: 'custom',
          path: ['endAt'],
          message: CREATE_BLOCK_MESSAGES.endBeforeStart,
        });
        return;
      }

      if (startAt.getTime() <= getNow().getTime()) {
        ctx.addIssue({
          code: 'custom',
          path: ['startAt'],
          message: CREATE_BLOCK_MESSAGES.startInPast,
        });
      }

      const start = getBoliviaParts(startAt);
      const end = getBoliviaParts(endAt);

      if (!start.isOnStep) {
        ctx.addIssue({
          code: 'custom',
          path: ['startAt'],
          message: CREATE_BLOCK_MESSAGES.invalidStep,
        });
      }
      if (!end.isOnStep) {
        ctx.addIssue({
          code: 'custom',
          path: ['endAt'],
          message: CREATE_BLOCK_MESSAGES.invalidStep,
        });
      }

      // 22:00 del mismo día es válido como fin; 00:00 del día siguiente no.
      if (start.day !== end.day) {
        ctx.addIssue({
          code: 'custom',
          path: ['endAt'],
          message: CREATE_BLOCK_MESSAGES.differentDays,
        });
        return;
      }

      if (start.minutesOfDay < BLOCK_MIN_HOUR * 60) {
        ctx.addIssue({
          code: 'custom',
          path: ['startAt'],
          message: CREATE_BLOCK_MESSAGES.outOfRange,
        });
      }
      if (end.minutesOfDay > BLOCK_MAX_HOUR * 60) {
        ctx.addIssue({
          code: 'custom',
          path: ['endAt'],
          message: CREATE_BLOCK_MESSAGES.outOfRange,
        });
      }
    });

export const createBlockSchema = buildCreateBlockSchema();

export type CreateBlockPayload = z.infer<typeof createBlockSchema>;
