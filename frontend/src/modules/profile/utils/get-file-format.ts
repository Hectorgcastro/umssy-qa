import { DOCUMENT_FORMAT_BY_EXTENSION } from "../constants/certification-form.constants";

export function getFileFormat(fileName: string): string {
  const extension = (fileName ?? "").split(".").pop()?.toLowerCase() ?? "";
  return DOCUMENT_FORMAT_BY_EXTENSION[extension] ?? extension.toUpperCase();
}
