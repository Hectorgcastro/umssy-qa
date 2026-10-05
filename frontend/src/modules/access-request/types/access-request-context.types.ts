import type { DocumentType } from "../constants/document-types.constants";
import type { FieldErrors, PersonalDataFieldName, PersonalDataValues } from "./access-request.types";

export type SubmitStatus = "idle" | "submitting" | "clearing" | "uploading" | "removing";

export type RequestStep = 1 | 2;

export type ClearResult = { ok: true } | { ok: false; message: string };

export interface FormNotice {
  type: "error" | "success";
  text: string;
}

// Solo metadatos del archivo: no se guarda el objeto File. previewUrl es una URL de objeto que el Context revoca
export interface DocumentState {
  documentType: DocumentType | null;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  previewUrl: string | null;
  progress: number;
  error: string | null;
}

export interface AccessRequestContextValue {
  values: PersonalDataValues;
  draftId: string | null;
  status: SubmitStatus;
  fieldErrors: FieldErrors;
  notice: FormNotice | null;
  hasData: boolean;
  currentStep: RequestStep;
  document: DocumentState;
  hasDocument: boolean;
  setValue: (field: PersonalDataFieldName, value: string) => void;
  submit: () => Promise<void>;
  clear: () => Promise<ClearResult>;
  goToStep: (step: RequestStep) => void;
  selectDocumentType: (type: DocumentType) => void;
  uploadDocument: (file: File) => Promise<void>;
  removeDocument: () => Promise<void>;
}
