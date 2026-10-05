import { z } from 'zod';
import { CAREER } from '../types/career.enum.js';
import { ID_CARD_ISSUED_IN } from '../types/id-card-issued-in.enum.js';

export const MIN_AGE = 18;

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: +[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const DIGITS_REGEX = /^\d+$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// V8 desplaza fechas como 2000-02-30 al 1 de marzo, por eso se compara el viaje de ida y vuelta
function isRealIsoDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isAdult(birthDate: Date, now = new Date()): boolean {
  const cutoff = Date.UTC(now.getUTCFullYear() - MIN_AGE, now.getUTCMonth(), now.getUTCDate());
  return birthDate.getTime() <= cutoff;
}

export function isGraduationYearCoherent(graduationYear: number, birthDate: Date): boolean {
  return graduationYear >= birthDate.getUTCFullYear() + MIN_AGE;
}

// El superRefine del objeto corre aunque un campo ya haya fallado: solo compara valores ya válidos
export function hasGraduationYearConflict(data: { graduationYear?: unknown; birthDate?: unknown }): boolean {
  const { graduationYear, birthDate } = data;
  if (typeof graduationYear !== 'number' || !(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
    return false;
  }
  return !isGraduationYearCoherent(graduationYear, birthDate);
}

// Los dos campos de nombre van en plural ("Los nombres", "Los apellidos")
const nameField = (label: string) =>
  z
    .string({ error: `${label} son obligatorios` })
    .trim()
    .min(1, `${label} son obligatorios`)
    .max(100, `${label} no pueden superar los 100 caracteres`)
    .regex(NAME_REGEX, `${label} solo pueden contener letras y espacios`);

const digitsField = (label: string) =>
  z
    .string({ error: `${label} es obligatorio` })
    .trim()
    .min(1, `${label} es obligatorio`)
    .max(20, `${label} no puede superar los 20 dígitos`)
    .regex(DIGITS_REGEX, `${label} solo puede contener dígitos`);

export const accessRequestFields = {
  firstName: nameField('Los nombres'),
  lastName: nameField('Los apellidos'),
  idCardNumber: digitsField('El carnet de identidad'),
  idCardIssuedIn: z.enum(ID_CARD_ISSUED_IN, { error: 'El departamento de expedición no es válido' }),
  sisCode: digitsField('El código SIS'),
  email: z
    .string({ error: 'El correo es obligatorio' })
    .trim()
    .toLowerCase()
    .max(150, 'El correo no puede superar los 150 caracteres')
    .pipe(z.email('El correo no tiene un formato válido')),
  phone: z
    .string({ error: 'El teléfono no es válido' })
    .trim()
    .regex(/^\d{8}$/, 'El teléfono debe tener 8 dígitos')
    .optional(),
  birthDate: z
    .string({ error: 'La fecha de nacimiento es obligatoria' })
    .regex(ISO_DATE_REGEX, 'La fecha de nacimiento debe tener el formato AAAA-MM-DD')
    .refine(isRealIsoDate, 'La fecha de nacimiento no es válida')
    .transform((value) => new Date(`${value}T00:00:00.000Z`))
    .refine((value) => Number.isNaN(value.getTime()) || isAdult(value), `Debes ser mayor de ${MIN_AGE} años`),
  career: z.enum(CAREER, { error: 'La carrera no es válida' }),
  graduationYear: z
    .number({ error: 'El año de titulación es obligatorio' })
    .int('El año de titulación debe ser un número entero')
    .refine((value) => value <= new Date().getUTCFullYear(), 'El año de titulación no puede ser futuro'),
};

export const GRADUATION_YEAR_COHERENCE_MESSAGE = `El año de titulación no puede ser anterior a los ${MIN_AGE} años de edad`;
