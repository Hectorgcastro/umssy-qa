const REQUEST_CODE_DIGITS = 4;

export const REQUEST_CODE_REGEX = /^SOL-\d{4}-\d{4,}$/;

export function requestCodePrefix(year: number): string {
  return `SOL-${year}-`;
}

// Siguiente código del año a partir del último existente (SOL-AAAA-NNNN); sin código previo empieza en 0001
export function nextRequestCode(year: number, lastCode: string | null | undefined): string {
  const prefix = requestCodePrefix(year);
  const lastNumber = lastCode?.startsWith(prefix) ? Number.parseInt(lastCode.slice(prefix.length), 10) : 0;
  const next = (Number.isNaN(lastNumber) ? 0 : lastNumber) + 1;
  return `${prefix}${String(next).padStart(REQUEST_CODE_DIGITS, '0')}`;
}

// Intentos para asignar un código ante envíos simultáneos que calculan el mismo siguiente número
export const MAX_REQUEST_CODE_ATTEMPTS = 8;

export const MIN_RETRY_DELAY_MS = 5;
export const MAX_RETRY_DELAY_MS = 40;

// Pausa aleatoria entre intentos para que los envíos en ráfaga dejen de chocar en el mismo instante
export function randomRetryDelayMs(random: () => number = Math.random): number {
  return MIN_RETRY_DELAY_MS + Math.floor(random() * (MAX_RETRY_DELAY_MS - MIN_RETRY_DELAY_MS + 1));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
