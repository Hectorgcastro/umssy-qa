export interface OrientationType {
  id: string;
  label: string;
}

export const ORIENTATION_TYPES: OrientationType[] = [
  {
    id: "career-guidance",
    label: "Orientación profesional",
  },
  {
    id: "technical-guidance",
    label: "Orientación técnica",
  },
  {
    id: "job-search",
    label: "Búsqueda de empleo",
  },
  {
    id: "interview-preparation",
    label: "Preparación para entrevistas",
  },
];