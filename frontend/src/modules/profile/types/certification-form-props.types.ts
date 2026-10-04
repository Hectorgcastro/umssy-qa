import type { CreateCertificationDto } from "./create-certification-dto.types";

export interface CertificationFormProps {
  initialData?: CreateCertificationDto;
  isPending?: boolean;
  onSubmit: (values: CreateCertificationDto) => void | Promise<void>;
  onCancel: () => void;
}
