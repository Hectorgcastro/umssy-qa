import { FileText } from "lucide-react";
import { formatDate } from "@/shared/utils/date.utils";
import { USER_DOCUMENT_LABELS } from "../constants/registered-users.constants";
import type { RejectedUser } from "../types/rejected-user.types";
import { getNoResultsMessage } from "../utils/no-results-message";
import { TableMessageRow, TableNoResultsRow, TableSkeletonRows } from "./table-state-rows";

interface RejectedUsersTableProps {
  users: RejectedUser[];
  isLoading: boolean;
  errorMessage?: string;
  searchTerm?: string;
}

const COLUMN_COUNT = 5;

export function RejectedUsersTable({ users, isLoading, errorMessage, searchTerm = "" }: RejectedUsersTableProps) {
  const renderBody = () => {
    if (isLoading) {
      return <TableSkeletonRows columnCount={COLUMN_COUNT} />;
    }

    if (errorMessage) {
      return <TableMessageRow columnCount={COLUMN_COUNT} message={errorMessage} />;
    }

    if (users.length === 0 && searchTerm) {
      return <TableNoResultsRow columnCount={COLUMN_COUNT} message={getNoResultsMessage(searchTerm)} />;
    }

    if (users.length === 0) {
      return <TableMessageRow columnCount={COLUMN_COUNT} message="No hay usuarios rechazados." />;
    }

    return users.map((user) => (
      <tr key={user.id} className="border-t border-border transition-colors hover:bg-surface-soft">
        <td className="px-6 py-4 text-ink">{user.fullName}</td>
        <td className="px-6 py-4 text-ink-soft">{user.email}</td>
        <td className="px-6 py-4 tabular-nums text-ink-soft">{user.identifier}</td>
        <td className="px-6 py-4">
          <span className="flex items-center gap-2 text-ink-soft">
            <FileText className="h-5 w-5 shrink-0 text-ink" strokeWidth={1.5} aria-hidden="true" />
            {USER_DOCUMENT_LABELS[user.documentType]}
          </span>
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-ink-soft">{formatDate(user.registeredAt)}</td>
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-surface-soft text-ink">
          <tr>
            <th scope="col" className="px-6 py-3 font-semibold">Usuario</th>
            <th scope="col" className="px-6 py-3 font-semibold">Correo</th>
            <th scope="col" className="px-6 py-3 font-semibold">Identificador</th>
            <th scope="col" className="px-6 py-3 font-semibold">Documento</th>
            <th scope="col" className="px-6 py-3 font-semibold">Fecha de Registro</th>
          </tr>
        </thead>
        <tbody aria-busy={isLoading}>{renderBody()}</tbody>
      </table>
    </div>
  );
}
