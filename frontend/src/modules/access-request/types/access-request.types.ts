import type { Career } from "../constants/careers.constants";
import type { IdCardIssuedIn } from "../constants/id-card-issued-in.constants";

// Valores del formulario del paso 1: todo llega como texto desde los controles
export interface PersonalDataValues {
  firstName: string;
  lastName: string;
  idCardNumber: string;
  idCardIssuedIn: string;
  sisCode: string;
  email: string;
  phone: string;
  birthDate: string;
  graduationYear: string;
  career: string;
}

export type PersonalDataFieldName = keyof PersonalDataValues;

export type FieldErrors = Partial<Record<PersonalDataFieldName, string>>;

// Cuerpo que acepta el backend (POST y PATCH)
export interface AccessRequestPayload {
  firstName: string;
  lastName: string;
  idCardNumber: string;
  idCardIssuedIn: IdCardIssuedIn;
  sisCode: string;
  email: string;
  phone?: string | null;
  birthDate: string;
  graduationYear: number;
  career: Career;
}

export interface CreateAccessRequestResponse {
  id: string;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; fieldErrors: FieldErrors; message: string };
