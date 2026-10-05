export interface CertificationDocumentFieldProps {
  selectedFile: File | null;
  error?: string;
  disabled?: boolean;
  isUploading?: boolean;
  onSelectFile: (file: File) => void;
  onClearFile: () => void;
}
