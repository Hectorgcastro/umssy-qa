"use client";

import { useState } from "react";
import { PageBreadcrumb, type BreadcrumbEntry } from "@/shared/components/layout";
import { ReportHistoryTable } from "../components/report-history-table";
import { TablePagination } from "../components/table-pagination";
import { useReportHistory } from "../hooks/use-report-history";

const BREADCRUMB_ITEMS: BreadcrumbEntry[] = [
  { label: "Inicio", href: "/dashboard" },
  { label: "Reportes Analíticos" },
  { label: "Historial de reportes generados" },
];

export function ReportHistoryView() {
  const [currentPage, setCurrentPage] = useState(1);
  const { reports, totalPages, isLoading, errorMessage } = useReportHistory(currentPage);

  return (
    <section className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <PageBreadcrumb items={BREADCRUMB_ITEMS} />
        <h1 className="font-tight text-3xl font-extrabold text-ink">Historial de Reportes Generados</h1>
      </header>

      <ReportHistoryTable reports={reports} isLoading={isLoading} errorMessage={errorMessage} />

      <div className="mt-auto flex justify-end">
        <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </section>
  );
}
