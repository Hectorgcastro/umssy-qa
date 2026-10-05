interface FieldErrorProps {
  id: string;
  message?: string;
}

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p id={id} className="mt-1.5 text-[12.5px] text-destructive 2xl:text-base">
      {message}
    </p>
  );
}
