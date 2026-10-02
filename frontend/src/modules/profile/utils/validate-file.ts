import { MAX_FILE_SIZE_BYTES } from "../config/file-upload.config";
import { FILE_VALIDATION_MESSAGES } from "../config/file-validation-messages.config";

function hasAllowedFormat(
  file: File,
  allowedTypes: readonly string[],
  allowedExtensions: readonly string[],
): boolean {
  if (file.type) {
    return allowedTypes.includes(file.type);
  }

  // Some systems leave the MIME type empty, so the extension of the name is checked instead.
  const fileName = file.name.toLowerCase();
  return allowedExtensions.some((extension) => fileName.endsWith(extension));
}

// Client-side check to guide the user; the backend validates the real content of the file.
// Returns the error message in Spanish, or null when the file is valid.
export function validateFile(
  file: File,
  allowedTypes: readonly string[],
  allowedExtensions: readonly string[],
  invalidTypeMessage: string,
): string | null {
  if (!hasAllowedFormat(file, allowedTypes, allowedExtensions)) {
    return invalidTypeMessage;
  }

  if (file.size === 0) {
    return FILE_VALIDATION_MESSAGES.emptyFile;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return FILE_VALIDATION_MESSAGES.fileTooLarge;
  }

  return null;
}
