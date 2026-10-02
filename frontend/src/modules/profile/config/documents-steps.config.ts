import type { DocumentsStep } from "../types/documents-step.types";

// Steps of the "Documentos" section: the CV first, then the certification documents.
export const DOCUMENTS_STEPS: DocumentsStep[] = [
  { id: "cv", number: "01", label: "Currículum vitae" },
  { id: "certifications", number: "02", label: "Certificaciones" },
];
