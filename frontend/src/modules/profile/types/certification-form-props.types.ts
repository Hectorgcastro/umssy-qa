import type { CertificationDocumentChange } from "./certification-document-change.types";
import type { CreateCertificationDto } from "./create-certification-dto.types";

export interface CertificationFormProps {
  initialData?: CreateCertificationDto;
  hasDocument?: boolean;
  isPending?: boolean;
  onSubmit: (
    values: CreateCertificationDto,
    documentChange: CertificationDocumentChange,
  ) => void | Promise<void>;
  onCancel: () => void;
}
