import type { AvailabilityBlockState } from "../types/availability-block-state.types";

export const WEEK_GRID_START_HOUR = 7;
export const WEEK_GRID_END_HOUR = 22;
export const HOUR_HEIGHT_PX = 25;
export const DAY_LABELS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"] as const;

export const STATE_BUTTON_VARIANT: Record<AvailabilityBlockState, "outline" | "default"> = {
  free: "outline",
  pending: "outline",
  confirmed: "default",
};

export const STATE_BUTTON_CLASSES: Record<AvailabilityBlockState, string> = {
  free: "",
  pending: "border-dashed border-muted-foreground",
  confirmed: "bg-ink border-ink text-white hover:bg-ink",
};

export const STATE_LABELS_ES: Record<AvailabilityBlockState, string> = {
  free: "libre",
  pending: "pendiente",
  confirmed: "confirmada",
};

export const SELECTED_BLOCK_CLASSES = "border-primary bg-primary/10 ring-2 ring-primary";

export const SELECTED_LEGEND_LABEL = "Tu selección";

export const EMPTY_DAY_LABEL = "Sin bloques";
