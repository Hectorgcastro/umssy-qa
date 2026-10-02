import type { FormFieldProps } from "../types/form-field-props.types";

export function FormField({ id, label, isRequired = false, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[12.5px] font-semibold text-ink">
        {label}
        {isRequired ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
