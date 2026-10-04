import type { Feedback } from "./feedback.types";
import type { WorkExperienceFormValues } from "./work-experience-form-values.types";

export interface WorkExperienceFormProps {
  initialValues?: WorkExperienceFormValues;
  isPending?: boolean;
  feedback?: Feedback | null;
  onSubmit: (values: WorkExperienceFormValues) => void | Promise<void>;
  onCancel: () => void;
}
