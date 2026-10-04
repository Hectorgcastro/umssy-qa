export type {
  AreaDetail,
  AreaId,
  AreaLevel,
  Certification,
  Course,
  ExperienceItem,
} from "./types/area-detail.types";
export {
  AREA_DETAILS,
  AREA_ORDER,
  CANDIDATE,
  GLOBAL_AVERAGE,
} from "./data/area-details.data";
export { calculateGap } from "./utils/calculate-gap";
export { formatDecimal } from "./utils/format-decimal";
export { getAreaDetail } from "./utils/get-area-detail";
export { getAreaLevel } from "./utils/get-area-level";
export type { AreaDetailPanelProps } from "./types/area-detail-components.types";
export { AreaDetailPanel } from "./components/area-detail-panel";
