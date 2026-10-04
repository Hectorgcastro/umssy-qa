export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificationDto {
  name: string;
  issuingOrganization: string;
  issueDate: string;
}

export type UpdateCertificationDto = Partial<CreateCertificationDto>;
