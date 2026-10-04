import { AlertDialog } from "@base-ui/react/alert-dialog";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConfirmDeleteDialogProps } from "../types/confirm-delete-dialog-props.types";

export function ConfirmDeleteDialog({
  isOpen,
  title,
  message,
  isDeleting = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={isDeleting ? undefined : onCancel}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-ink/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface p-8 text-ink shadow-lg transition duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0">
          <AlertDialog.Title className="font-tight text-[22px] font-bold text-ink">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-[15px] text-text-secondary">{message}</AlertDialog.Description>
          <div className="mt-8 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 border-border-strong bg-surface px-6 text-[14px] font-semibold text-ink hover:bg-surface-soft"
              disabled={isDeleting}
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="h-12 bg-accent px-6 text-[14px] font-semibold text-white hover:bg-danger"
              disabled={isDeleting}
              onClick={onConfirm}
            >
              {isDeleting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
              {isDeleting
                ? "Eliminando..."
                : "Eliminar"}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
