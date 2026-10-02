import type { ReactNode } from "react";

export interface FormFieldProps {
  id: string;
  label: string;
  isRequired?: boolean;
  children: ReactNode;
}
