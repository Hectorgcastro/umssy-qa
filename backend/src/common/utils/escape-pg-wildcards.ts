/**
 * Escapes PostgreSQL ILIKE / LIKE wildcard characters (%, _, \) so they are treated as literal characters.
 */
export function escapePgWildcards(term: string): string {
  return term.replace(/[%_\\]/g, '\\$&');
}
