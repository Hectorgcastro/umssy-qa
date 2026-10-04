export interface ProfilePhotoFieldProps {
  photoUrl?: string | null;
  isUploading?: boolean;
  error?: string | null;
  onSelectPhoto?: (file: File) => void;
}
