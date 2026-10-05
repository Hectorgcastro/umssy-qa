import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalDataFieldProps extends ComponentProps<typeof Input> {
  id: string;
  label: ReactNode;
  help?: string;
  icon?: ReactNode;
}

export function PersonalDataField({
  id,
  label,
  help,
  icon,
  className,
  ...inputProps
}: PersonalDataFieldProps) {
  const helpId = help ? `${id}-help` : undefined;

  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 text-[12.5px] font-semibold text-ink">
        {label}
      </Label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-secondary">
            {icon}
          </span>
        ) : null}
        <Input
          id={id}
          name={id}
          aria-describedby={helpId}
          className={`h-[42px] rounded-md border-border bg-surface text-[15px] text-ink focus-visible:border-accent focus-visible:ring-interaction md:text-[15px] ${
            icon ? "pl-10" : "px-3"
          }`}
          {...inputProps}
        />
      </div>
      {help ? (
        <p id={helpId} className="mt-1.5 text-[12.5px] text-text-secondary">
          {help}
        </p>
      ) : null}
    </div>
  );
}
