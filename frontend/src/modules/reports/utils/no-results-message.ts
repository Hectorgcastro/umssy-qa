const ONLY_DIGITS_PATTERN = /^\d+$/;
const EMAIL_LIKE_PATTERN = /@|^\S+\.\S+$/;

// Arma el mensaje de "sin resultados" según lo que parece haber escrito el usuario.
export function getNoResultsMessage(searchTerm: string): string {
  const term = searchTerm.trim();

  if (ONLY_DIGITS_PATTERN.test(term)) {
    return "No se encontró ningún usuario con el identificador";
  }

  if (EMAIL_LIKE_PATTERN.test(term)) {
    return "No se encontró ningún usuario con el correo";
  }

  return "No se encontró ningún usuario con el nombre";
}
