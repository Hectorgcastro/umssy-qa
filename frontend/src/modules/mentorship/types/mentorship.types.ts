export type MentorshipStep = 1 | 2 | 3 | 4;

export interface MentorshipStepDefinition {
  id: MentorshipStep;
  label: string;
  description: string;
}

export const MENTORSHIP_STEPS: MentorshipStepDefinition[] = [
  {
    id: 1,
    label: "Participación",
    description: "Configura tu participación como mentor",
  },
  {
    id: 2,
    label: "Áreas técnicas",
    description: "Selecciona tus áreas técnicas",
  },
  {
    id: 3,
    label: "Tipos de orientación",
    description: "Selecciona los tipos de orientación",
  },
  {
    id: 4,
    label: "Confirmación",
    description: "Revisa tu configuración",
  },
];
export interface TechnicalArea {
  id: string;
  name: string;
  description: string;
  icon: string; // nombre del icono de Lucide
}
/** Estado completo del wizard (se irá llenando en T2-T5) */
export interface MentorshipWizardState {
  currentStep: MentorshipStep;
  wantsToParticipate: boolean;
  selectedTechnicalAreaIds: string[];
  selectedOrientationTypeIds: string[];
}
