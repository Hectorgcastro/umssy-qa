import type { AvailabilityBlock } from "./availability-block.types";

export interface AvailabilityBlockListProps {
  blocks: AvailabilityBlock[];
  emptyMessage: string;
  onDelete?: (block: AvailabilityBlock) => void;
}
