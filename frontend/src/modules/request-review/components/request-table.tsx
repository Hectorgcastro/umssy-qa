"use client";

import Link from "next/link";
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
import { formatRelativeTime } from "../utils/format-relative-time";

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
                  <div className="flex flex-col">
                    <span className="font-medium text-ink">{item.fullName}</span>
                    <span className="text-xs text-text-secondary">{item.email}</span>
                  </div>
                </TableCell>
                <TableCell>{item.sisCode}</TableCell>
                <TableCell>{item.documentType ? (DOCUMENT_TYPE_LABELS[item.documentType] ?? item.documentType) : "Sin documento"}</TableCell>
                <TableCell>{formatRelativeTime(item.submittedAt)}</TableCell>
                <TableCell>{REVIEW_STATUS_LABELS[item.status] ?? item.status}</TableCell>
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
