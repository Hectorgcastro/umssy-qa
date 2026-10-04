import type { CreateCertificationDto } from "./certification.types";

export interface CertificationFormProps {
  initialData?: CreateCertificationDto;
  isPending?: boolean;
  onSubmit: (values: CreateCertificationDto) => void | Promise<void>;
  onCancel: () => void;
}
