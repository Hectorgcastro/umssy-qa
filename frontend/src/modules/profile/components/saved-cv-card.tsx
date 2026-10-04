import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SavedCvCardProps } from "../types/saved-cv-card-props.types";
import { formatFileSize } from "../utils/format-file-size";
import { formatUploadDate } from "../utils/format-upload-date";
import { SectionCard } from "./section-card";

export function SavedCvCard({ savedCv, isBusy = false, onReplace, onDelete }: SavedCvCardProps) {
  return (
    <SectionCard title="Archivo guardado">
      {savedCv ? (
        <div>
          <p className="text-[15px] font-bold break-words text-ink">{savedCv.fileName}</p>
          <p className="mt-1 text-[13px] text-text-secondary">
            {savedCv.fileType} · {formatFileSize(savedCv.sizeInBytes)} · Actualizado el{" "}
            {formatUploadDate(savedCv.updatedAt)}
          </p>
          <p className="mt-3 flex items-center gap-2 border-b border-border pb-5 text-[13px] font-semibold text-ink-soft">
            <Check aria-hidden="true" className="size-4" />
            Cargado correctamente
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 border-border-strong bg-surface px-6 text-[14px] font-semibold text-ink hover:bg-surface-soft"
              disabled={!onReplace || isBusy}
              title={onReplace ? undefined : "Disponible próximamente"}
              onClick={onReplace}
            >
              Reemplazar CV
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 border-accent bg-surface px-6 text-[14px] font-semibold text-accent hover:bg-interaction hover:text-accent"
              disabled={!onDelete || isBusy}
              title={onDelete ? undefined : "Disponible próximamente"}
              onClick={onDelete}
            >
              Eliminar CV
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-[14px] text-text-secondary">
          Al confirmar la carga, el archivo se mostrará aquí.
        </p>
      )}
    </SectionCard>
  );
}
