import type { SavedCv } from "./saved-cv.types";

export interface SavedCvCardProps {
  savedCv: SavedCv | null;
  onReplace?: () => void;
  onDelete?: () => void;
}
