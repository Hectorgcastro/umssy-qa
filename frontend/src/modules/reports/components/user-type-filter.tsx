import { ChevronDown } from "lucide-react";
import { USER_TYPE_FILTER_OPTIONS, USER_TYPE_LABELS } from "../constants/registered-users.constants";
import type { UserType } from "../types/registered-user.types";

interface UserTypeFilterProps {
  value?: UserType;
  onChange: (userType?: UserType) => void;
}

const ALL_USER_TYPES_VALUE = "ALL";

export function UserTypeFilter({ value, onChange }: UserTypeFilterProps) {
  return (
    <div className="relative w-full sm:w-72">
      <label
        htmlFor="user-type-filter"
        className="pointer-events-none absolute left-3 top-1.5 text-xs text-text-secondary"
      >
        Tipo de usuario
      </label>
      <select
        id="user-type-filter"
        value={value ?? ALL_USER_TYPES_VALUE}
        onChange={(event) => {
          const selectedValue = event.target.value;
          onChange(selectedValue === ALL_USER_TYPES_VALUE ? undefined : (selectedValue as UserType));
        }}
        className="w-full appearance-none rounded-md border border-border bg-surface px-3 pb-2 pt-6 pr-10 text-sm text-ink focus:border-ink-soft focus:outline-none"
      >
        <option value={ALL_USER_TYPES_VALUE}>Todos</option>
        {USER_TYPE_FILTER_OPTIONS.map((userType) => (
          <option key={userType} value={userType}>
            {USER_TYPE_LABELS[userType]}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
        aria-hidden="true"
      />
    </div>
  );
}
