import type { FieldErrors, PersonalDataFieldName, PersonalDataValues } from "./access-request.types";

export type SubmitStatus = "idle" | "submitting" | "clearing";

export type ClearResult = { ok: true } | { ok: false; message: string };

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
  hasData: boolean;
  setValue: (field: PersonalDataFieldName, value: string) => void;
  submit: () => Promise<void>;
  clear: () => Promise<ClearResult>;
}
