import { Award, Edit, FileText, Paperclip, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CertificationCardProps } from "../types/certification-card-props.types";
import { formatIssueDate } from "../utils/format-issue-date";

export function CertificationCard({
  certification,
  isBusy = false,
  onEdit,
  onDelete,
  onViewDocument,
}: CertificationCardProps) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-4">
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-ink-soft">
          <Award aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h3 className="text-[15px] font-bold text-ink">{certification.name}</h3>
          <p className="mt-0.5 text-[13px] text-text-secondary">
            {certification.issuingOrganization}
          </p>
          <p className="mt-0.5 text-[13px] text-text-secondary">
            Obtenida el{" "}
            <time dateTime={certification.issueDate}>
              {formatIssueDate(certification.issueDate)}
            </time>
          </p>
          {certification.hasDocument ? (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-soft px-2.5 py-1 text-[12px] font-semibold text-ink-soft">
              <Paperclip aria-hidden="true" className="size-3.5" />
              Documento adjunto
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {certification.hasDocument && onViewDocument ? (
          <Button
            type="button"
            variant="ghost"
            aria-label={`Ver documento de ${certification.name}`}
            disabled={isBusy}
            onClick={() => onViewDocument(certification)}
            className="h-8 gap-1.5 px-2 text-[13px] font-semibold text-ink"
          >
            <FileText aria-hidden="true" className="size-4" />
            Ver documento
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          aria-label={`Editar ${certification.name}`}
          disabled={isBusy}
          onClick={() => onEdit(certification)}
          className={`h-8 gap-1.5 px-2 text-[13px] font-semibold text-ink`}
        >
          <Edit aria-hidden="true" className="size-4" />
          Editar
        </Button>
        <Button
          type="button"
          variant="ghost"
          aria-label={`Eliminar ${certification.name}`}
          disabled={isBusy}
          onClick={() => onDelete(certification)}
          className={`h-8 gap-1.5 px-2 text-[13px] font-semibold text-accent hover:bg-interaction hover:text-accent`}
        >
          <Trash2 aria-hidden="true" className="size-4" />
          Eliminar
        </Button>
      </div>
    </article>
  );
}
