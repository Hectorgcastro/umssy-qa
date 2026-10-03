export interface OrientationOption {
  id: string;
  value: string;
  label: string;
  iconName: string; // Nombre del icono de Lucide
}

export interface MentorOrientationProps {
  initialSelected?: string[];
  onSave?: (selectedValues: string[]) => void;
}