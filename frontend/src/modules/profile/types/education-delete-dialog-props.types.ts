import type { Feedback } from "./feedback.types";

export interface EducationDeleteDialogProps {
  isOpen: boolean;
  degree: string;
  isDeleting: boolean;
  feedback: Feedback | null;
  onConfirm: () => void;
  onCancel: () => void;
}
