import { CV_ALLOWED_EXTENSIONS, CV_ALLOWED_TYPES } from "./file-upload.config";

export const CV_FILE_TYPE_LABEL = "PDF";

export const CV_FILE_INPUT_ACCEPT = [...CV_ALLOWED_TYPES, ...CV_ALLOWED_EXTENSIONS].join(",");

export const CV_FEEDBACK_MESSAGES = {
  uploaded: "Tu CV se cargó correctamente.",
  replaced: "Tu CV se reemplazó correctamente.",
  deleted: "Tu CV se eliminó.",
};
