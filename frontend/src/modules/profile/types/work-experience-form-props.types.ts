import type { WorkExperienceFormValues } from "./work-experience-form-values.types";

export interface WorkExperienceFormProps {
  initialValues?: WorkExperienceFormValues;
  isPending?: boolean;
  onSubmit: (values: WorkExperienceFormValues) => void | Promise<void>;
  onCancel: () => void;
}
