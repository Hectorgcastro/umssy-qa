interface ExportErrorMessageProps {
  message?: string;
}

// Mensaje de error de la exportación, centrado debajo de la tabla del reporte.
export function ExportErrorMessage({ message }: ExportErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className="text-center text-sm text-accent">
      {message}
    </p>
  );
}
