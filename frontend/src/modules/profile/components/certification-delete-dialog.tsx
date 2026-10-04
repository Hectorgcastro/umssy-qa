import { CERTIFICATION_DELETE_DIALOG_TEXTS } from "../config/certification-feedback.config";
import type { CertificationDeleteDialogProps } from "../types/certification-delete-dialog-props.types";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";

export function CertificationDeleteDialog({
  certification,
  isDeleting = false,
  onConfirm,
  onCancel,
}: CertificationDeleteDialogProps) {
  return (
    <ConfirmDeleteDialog
      isOpen={certification !== null}
      title={CERTIFICATION_DELETE_DIALOG_TEXTS.title}
      message={CERTIFICATION_DELETE_DIALOG_TEXTS.getMessage(certification?.name ?? "")}
      isDeleting={isDeleting}
      onConfirm={() => {
        if (certification) {
          onConfirm(certification);
        }
      }}
      onCancel={onCancel}
    />
  );
}
