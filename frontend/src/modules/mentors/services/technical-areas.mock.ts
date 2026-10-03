import type { TechnicalArea } from "../types/technical-area.types";

// Datos de prueba: se reemplazan por GET /technical-areas cuando el backend esté listo
export const MOCK_TECHNICAL_AREAS: TechnicalArea[] = [
  { id: 1, name: "Backend", description: "APIs, lógica de negocio" },
  { id: 2, name: "Desarrollo Web", description: "Frontend & SPAs" },
  { id: 3, name: "Bases de Datos", description: "SQL, NoSQL, modelado" },
  { id: 4, name: "QA", description: "Testing & calidad" },
  { id: 5, name: "Datos", description: "Pipelines, BI, Machine Learning" },
  { id: 6, name: "Cloud", description: "Infraestructura, DevOps" },
  { id: 7, name: "Redes", description: "Seguridad & comunicaciones" },
  { id: 8, name: "Arquitectura", description: "Sistemas distribuidos & diseño" },
];

// Áreas que el mentor ya tiene guardadas (Backend, Cloud y Arquitectura)
export const MOCK_MENTOR_AREA_IDS: number[] = [1, 6, 8];

const STORAGE_KEY = "umssy-demo-mentor-technical-areas";

export async function loadMentorAreas(): Promise<number[]> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [...MOCK_MENTOR_AREA_IDS];
  try {
    const ids: unknown = JSON.parse(stored);
    if (Array.isArray(ids) && ids.length > 0 && ids.every(
      (id) => MOCK_TECHNICAL_AREAS.some((area) => area.id === id),
    )) return [...new Set(ids as number[])];
  } catch {
    // Invalid demo data falls back to the initial selection.
  }
  return [...MOCK_MENTOR_AREA_IDS];
}

export async function saveMentorAreas(areaIds: number[]): Promise<void> {
  if (!areaIds.length) throw new Error("At least one area is required");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(areaIds));
}
