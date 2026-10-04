function padNumber(value: number): string {
  return value.toString().padStart(2, "0");
}

// Formato "AAAA-MM-DD HH:mm" en la hora local del usuario.
export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const datePart = `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
  const timePart = `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;

  return `${datePart} ${timePart}`;
}

// Formato "DD/MM/AAAA" en la hora local del usuario.
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()}`;
}
