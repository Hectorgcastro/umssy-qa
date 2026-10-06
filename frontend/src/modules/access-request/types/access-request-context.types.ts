import type { FieldErrors, PersonalDataFieldName, PersonalDataValues } from "./access-request.types";

export type SubmitStatus = "idle" | "submitting";

export interface FormNotice {
  type: "error" | "success";
  text: string;
}

export interface AccessRequestContextValue {
  values: PersonalDataValues;
  draftId: string | null;
  status: SubmitStatus;
  fieldErrors: FieldErrors;
  notice: FormNotice | null;
  setValue: (field: PersonalDataFieldName, value: string) => void;
  submit: () => Promise<void>;
}
