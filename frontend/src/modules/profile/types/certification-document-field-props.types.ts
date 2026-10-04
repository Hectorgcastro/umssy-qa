export interface CertificationDocumentFieldProps {
  selectedFile: File | null;
  error?: string;
  disabled?: boolean;
  onSelectFile: (file: File) => void;
}
