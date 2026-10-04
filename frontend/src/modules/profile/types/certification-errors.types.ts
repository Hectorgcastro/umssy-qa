import type { CreateCertificationDto } from "./certification.types";

export type CertificationErrors = Partial<Record<keyof CreateCertificationDto, string>>;
