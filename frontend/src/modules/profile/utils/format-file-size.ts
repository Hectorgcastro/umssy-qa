import { BYTES_PER_KB, BYTES_PER_MB } from "../config/file-upload.config";

// One decimal with a dot, without a trailing ".0" (1.2, 5, 350).
function formatOneDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

// Formats a size in bytes as KB or MB, for example "1.2 MB".
export function formatFileSize(bytes: number): string {
  if (bytes < BYTES_PER_MB) {
    return `${formatOneDecimal(bytes / BYTES_PER_KB)} KB`;
  }

  return `${formatOneDecimal(bytes / BYTES_PER_MB)} MB`;
}
