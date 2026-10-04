import type { AvailabilityBlockState } from "../types/availability-block-state.types";

export const BOLIVIA_TIME_LABEL = "Hora de Bolivia (GMT-4)";

export const STATE_LABELS: Record<AvailabilityBlockState, string> = {
  free: "BLOQUE LIBRE",
  pending: "BLOQUE PENDIENTE",
  confirmed: "BLOQUE CONFIRMADO",
};

export const DELETE_BLOCK_ERROR = "Error al eliminar el bloque de disponibilidad";
