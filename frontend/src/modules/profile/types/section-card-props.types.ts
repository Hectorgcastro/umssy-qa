import type { ReactNode } from "react";

export interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}
