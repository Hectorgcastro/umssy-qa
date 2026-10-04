const FILE_NAME_PATTERN = /filename="?([^";]+)"?/i;

// Obtiene el nombre del archivo desde la cabecera Content-Disposition del backend.
export function getFileNameFromDisposition(disposition: string | undefined, fallbackName: string): string {
  return disposition?.match(FILE_NAME_PATTERN)?.[1] ?? fallbackName;
}

// Descarga en el navegador un archivo recibido del backend.
export function downloadFile(file: Blob, fileName: string): void {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
