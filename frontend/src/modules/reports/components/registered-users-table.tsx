import { REGISTERED_USERS_COLUMNS } from "../constants/registered-users-report";

export function RegisteredUsersTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-soft">
          <tr>
            {REGISTERED_USERS_COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className="whitespace-nowrap px-4 py-3 font-semibold text-ink"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={REGISTERED_USERS_COLUMNS.length}
              className="px-4 py-12 text-center text-text-secondary"
            >
              No hay usuarios registrados para mostrar.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
