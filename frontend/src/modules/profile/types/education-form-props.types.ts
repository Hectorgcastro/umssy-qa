import type { EducationFormValues } from "./education-form-values.types";
import type { Feedback } from "./feedback.types";

export interface EducationFormProps {
  initialValues?: EducationFormValues;
  isPending?: boolean;
  feedback?: Feedback | null;
  onSubmit: (values: EducationFormValues) => void | Promise<void>;
  onCancel: () => void;
}
