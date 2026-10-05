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
