import { CircleCheck } from "lucide-react";

interface ExportSuccessToastProps {
  message?: string;
}

// Notificación verde que confirma una exportación exitosa, flotando sobre la parte inferior de la vista.
export function ExportSuccessToast({ message }: ExportSuccessToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <p
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 rounded-md border border-success bg-success-soft px-4 py-2.5 text-sm font-medium text-ink shadow-md animate-in fade-in slide-in-from-bottom-2"
      >
        <CircleCheck className="size-5 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
        {message}
      </p>
    </div>
  );
}
