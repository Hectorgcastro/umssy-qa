export const EDUCATION_DESCRIPTION_MAX_LENGTH = 400;

export const EDUCATION_VALIDATION_MESSAGES = {
  institutionRequired: "La institución es obligatoria.",
  degreeRequired: "El título o carrera es obligatorio.",
  descriptionTooLong: `La descripción no puede superar los ${EDUCATION_DESCRIPTION_MAX_LENGTH} caracteres.`,
  startDateRequired: "La fecha de inicio es obligatoria.",
  endDateRequired: "La fecha de fin es obligatoria.",
  invalidDate: "Ingresa una fecha válida.",
  invalidDateRange: "La fecha de fin no puede ser anterior a la fecha de inicio.",
};

export const EDUCATION_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
