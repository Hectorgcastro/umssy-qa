"use client";

import Link from "next/link";
import { CircleCheck, CircleX, FileText, Hourglass, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DOCUMENT_TYPE_LABELS,
  INBOX_PATH,
  REVIEW_PAGE_SIZE,
  REVIEW_STATUS_LABELS,
} from "../constants/request-review.constants";
import type { ReviewListItem } from "../types/request-review.types";
import { getInitials } from "@/shared/utils/get-initials";
import { formatRelativeTime } from "../utils/format-relative-time";

const STATUS_ICONS = { pending: Hourglass, in_review: Search, approved: CircleCheck, rejected: CircleX } as const;

interface RequestTableProps {
  items?: ReviewListItem[];
  isLoading?: boolean;
}

export function RequestTable({ items = [], isLoading = false }: RequestTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Solicitante</TableHead>
          <TableHead>Código SIS</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead>Enviada</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: REVIEW_PAGE_SIZE / 2 }, (_, index) => (
              <TableRow key={index} data-testid="request-skeleton-row">
                {Array.from({ length: 6 }, (_, cell) => (
                  <TableCell key={cell}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-surface"
                      aria-hidden="true"
                    >
                      {getInitials(item.fullName)}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-ink">{item.fullName}</span>
                      <span className="text-xs text-text-secondary">{item.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.sisCode}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="size-4 text-text-secondary" aria-hidden="true" />
                    {item.documentType ? (DOCUMENT_TYPE_LABELS[item.documentType] ?? item.documentType) : "Sin documento"}
                  </span>
                </TableCell>
                <TableCell>{formatRelativeTime(item.submittedAt)}</TableCell>
                <TableCell>
                  {/* Pastilla neutra: el estado se lee por su texto, sin colores de semáforo */}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-2.5 py-0.5 text-xs font-medium text-ink">
                    {(() => {
                      const StatusIcon = STATUS_ICONS[item.status];
                      return StatusIcon ? <StatusIcon className="size-3.5" aria-hidden="true" /> : null;
                    })()}
                    {REVIEW_STATUS_LABELS[item.status] ?? item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {/* Button con render={<Link />} no es un botón nativo; por eso se usa Link con las clases de buttonVariants */}
                  <Link href={`${INBOX_PATH}/${item.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Revisar
                  </Link>
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
