import type { Certification } from "./certification.types";

export interface CertificationDocumentsPanelProps {
  certifications?: Certification[];
  isBusy?: boolean;
  onUpload: (certification: Certification, file: File) => boolean | Promise<boolean>;
  onRemove: (certification: Certification) => boolean | Promise<boolean>;
  onView: (certification: Certification) => void;
  onInvalidFile: (message: string) => void;
}
