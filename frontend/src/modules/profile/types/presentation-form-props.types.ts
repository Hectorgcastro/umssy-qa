import type { PresentationValues } from "./presentation-values.types";

export interface PresentationFormProps {
  initialValues: PresentationValues;
  fullName: string;
  photoUrl?: string | null;
  isSaving?: boolean;
  onSubmit: (values: PresentationValues) => void;
}
