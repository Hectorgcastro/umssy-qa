export const SKILLS_ERROR_MESSAGES = {
  load: "No se pudieron cargar tus habilidades. Intenta de nuevo más tarde.",
  save: "No se pudieron guardar tus habilidades. Intenta de nuevo.",
};

export const SKILLS_ERROR_MESSAGES_BY_STATUS: Record<number, string> = {
  400: "Revisa las habilidades seleccionadas e intenta de nuevo.",
  401: "Tu sesión no es válida. Inicia sesión nuevamente.",
  404: "Alguna habilidad ya no está disponible. Recarga la página.",
  409: "No puedes agregar la misma habilidad dos veces.",
};

export const SKILLS_SUCCESS_MESSAGES = {
  saved: "Tus habilidades se guardaron correctamente.",
};

export const SKILLS_VALIDATION_MESSAGES = {
  emptyName: "El nombre no puede estar vacío.",
  duplicated: "Esta habilidad ya existe en el catálogo o en tus habilidades.",
};
