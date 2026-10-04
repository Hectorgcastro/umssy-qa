import { CERTIFICATE_ALLOWED_EXTENSIONS } from "./file-upload.config";

export const CERTIFICATE_FILE_ACCEPT = CERTIFICATE_ALLOWED_EXTENSIONS.join(",");

export const DOCUMENT_URL_LIFETIME_MS = 60_000;

export const CERTIFICATION_DOCUMENT_MESSAGES = {
  uploadSuccess: "Documento adjuntado correctamente.",
  uploadError: "La certificación se guardó, pero no se pudo adjuntar el documento.",
  removeSuccess: "Documento quitado correctamente.",
  removeError: "La certificación se guardó, pero no se pudo quitar el documento.",
  openError: "No se pudo abrir el documento. Inténtalo de nuevo.",
  notFound: "Esta certificación no tiene un documento adjunto.",
};
