"use client";

import { useState } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/shared/components/layout";
import { RefreshButton } from "../components/refresh-button";
import { RegisteredUsersTable } from "../components/registered-users-table";
import { ReportActions } from "../components/report-actions";
import { TablePagination } from "../components/table-pagination";
import { UserTypeFilter } from "../components/user-type-filter";
import { REGISTERED_USERS_PAGE_SIZE, useRegisteredUsers } from "../hooks/use-registered-users";
import type { UserType } from "../types/registered-user.types";

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: "Inicio", href: "/dashboard" },
  { label: "Reportes Analíticos" },
  { label: "Reporte de usuarios registrados" },
];

export function RegisteredUsersReportView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [userType, setUserType] = useState<UserType | undefined>(undefined);
  const { users, totalItems, totalPages, isLoading, errorMessage } = useRegisteredUsers(currentPage, userType);

  const handleUserTypeChange = (selectedUserType?: UserType) => {
    setUserType(selectedUserType);
    setCurrentPage(1);
  };

  const firstVisibleItem = totalItems === 0 ? 0 : (currentPage - 1) * REGISTERED_USERS_PAGE_SIZE + 1;
  const lastVisibleItem = Math.min(currentPage * REGISTERED_USERS_PAGE_SIZE, totalItems);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Breadcrumb items={BREADCRUMB_ITEMS} />
        <h1 className="font-tight text-3xl font-extrabold text-ink">Reporte de usuarios registrados</h1>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <UserTypeFilter value={userType} onChange={handleUserTypeChange} />
        <ReportActions />
      </div>

      <RegisteredUsersTable users={users} isLoading={isLoading} errorMessage={errorMessage} />

      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
        <p className="text-center text-sm text-text-secondary md:text-left">
          {isLoading ? "Cargando usuarios..." : `Mostrando ${firstVisibleItem}-${lastVisibleItem} de ${totalItems} usuarios`}
        </p>
        <div className="flex justify-center">
          <RefreshButton />
        </div>
        <div className="flex justify-center md:justify-end">
          <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </section>
  );
}
