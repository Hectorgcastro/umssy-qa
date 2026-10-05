export interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}