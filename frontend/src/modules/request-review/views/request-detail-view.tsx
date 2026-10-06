"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataContrastPanel } from "../components/data-contrast-panel";
import { DocumentViewer } from "../components/document-viewer";
import { INBOX_PATH, REVIEW_STATUS_LABELS } from "../constants/request-review.constants";
import { useDocumentUrl } from "../hooks/use-document-url";
import { useRequestDetail } from "../hooks/use-request-detail";

export function RequestDetailView({ id }: { id: string }) {
  const { detail, error, isLoading } = useRequestDetail(id);
  const document = useDocumentUrl(id, Boolean(detail?.document));

  return (
    <section className="flex flex-col gap-6">
      <Link href={INBOX_PATH} className="flex items-center gap-1 text-sm text-ink-soft hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver a la bandeja
      </Link>

      {isLoading && (
        <div className="flex flex-col gap-4" data-testid="detail-skeleton">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-96 w-full" />
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-md border border-border bg-surface p-4 text-sm text-ink">
          {error}
        </p>
      )}

      {detail && (
        <>
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-ink">
              Solicitud {detail.requestCode ?? ""} · {detail.firstName} {detail.lastName}
            </h1>
            <p className="text-sm text-text-secondary">
              {detail.email} · Estado: {REVIEW_STATUS_LABELS[detail.status] ?? detail.status}
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              {!detail.document && (
                <p className="rounded-md border border-border bg-surface p-4 text-sm text-text-secondary">
                  Esta solicitud no tiene un documento adjunto.
                </p>
              )}
              {detail.document && document.isLoading && <Skeleton className="h-[32rem] w-full" />}
              {detail.document && document.error && (
                <p role="alert" className="rounded-md border border-border bg-surface p-4 text-sm text-ink">
                  {document.error}
                </p>
              )}
              {detail.document && document.url && (
                <DocumentViewer
                  url={document.url}
                  mimeType={detail.document.mimeType}
                  fileName={`${detail.document.name}.${detail.document.extension}`}
                />
              )}
            </div>
            <DataContrastPanel detail={detail} />
          </div>
        </>
      )}
    </section>
  );
}
