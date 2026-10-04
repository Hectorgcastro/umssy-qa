"use client";

import { useState } from "react";
import { PageBreadcrumb, type BreadcrumbEntry } from "@/shared/components/layout";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { UserSearchInput } from "../components/user-search-input";
import { ExportCsvButton } from "../components/export-csv-button";
import { ExportErrorMessage } from "../components/export-error-message";
import { RefreshButton } from "../components/refresh-button";
import { RejectedUsersTable } from "../components/rejected-users-table";
import { TablePagination } from "../components/table-pagination";
import { useExportRejectedUsersCsv } from "../hooks/use-export-rejected-users-csv";
import { REJECTED_USERS_PAGE_SIZE, useRejectedUsers } from "../hooks/use-rejected-users";

const BREADCRUMB_ITEMS: BreadcrumbEntry[] = [
  { label: "Inicio", href: "/dashboard" },
  { label: "Reportes Analíticos" },
  { label: "Reporte de usuarios rechazados" },
];

const SEARCH_DEBOUNCE_MS = 400;

export function RejectedUsersReportView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);
  const { users, totalItems, totalPages, isLoading, errorMessage, refresh } = useRejectedUsers(currentPage, search);
  const { exportCsv, isExporting, errorMessage: exportErrorMessage } = useExportRejectedUsersCsv(search);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
  };

  const firstVisibleItem = totalItems === 0 ? 0 : (currentPage - 1) * REJECTED_USERS_PAGE_SIZE + 1;
  const lastVisibleItem = Math.min(currentPage * REJECTED_USERS_PAGE_SIZE, totalItems);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <PageBreadcrumb items={BREADCRUMB_ITEMS} />
        <h1 className="font-tight text-3xl font-extrabold uppercase text-ink">Reporte de usuarios rechazados</h1>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <UserSearchInput value={searchInput} onChange={handleSearchChange} />
        <div className="flex flex-wrap items-center gap-3">
          <RefreshButton label="Actualizar" onClick={refresh} isRefreshing={isLoading} />
          <ExportCsvButton onClick={exportCsv} isExporting={isExporting} />
        </div>
      </div>

      <RejectedUsersTable
        users={users}
        isLoading={isLoading}
        errorMessage={errorMessage}
        searchTerm={search}
      />

      <ExportErrorMessage message={exportErrorMessage} />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-text-secondary">
          {isLoading ? "Cargando usuarios..." : `Mostrando ${firstVisibleItem}-${lastVisibleItem} de ${totalItems} usuarios`}
        </p>
        <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </section>
  );
}
