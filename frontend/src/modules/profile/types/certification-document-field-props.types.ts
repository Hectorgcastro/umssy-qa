export interface CertificationDocumentFieldProps {
  selectedFile: File | null;
  hasCurrentDocument: boolean;
  error?: string;
  disabled?: boolean;
  onSelectFile: (file: File) => void;
  onRemove: () => void;
}
