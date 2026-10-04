import type { Certification } from "./certification.types";

export type CertificationFormState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; certification: Certification };
