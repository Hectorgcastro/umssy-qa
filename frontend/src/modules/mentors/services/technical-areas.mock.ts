import type { TechnicalArea } from "../types/technical-area.types";
import {
  getMentorParticipation,
  updateMentorParticipation,
} from "@/shared/services/mentor-participation.service";

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

export async function loadMentorAreas(): Promise<number[]> {
  const participation = getMentorParticipation();
  const ids = participation?.areas.flatMap((name) => {
    const area = MOCK_TECHNICAL_AREAS.find((candidate) => candidate.name === name);
    return area ? [area.id] : [];
  });

  if (ids?.length) return [...new Set(ids)];
  return [...MOCK_MENTOR_AREA_IDS];
}

export async function saveMentorAreas(areaIds: number[]): Promise<void> {
  if (!areaIds.length) throw new Error("At least one area is required");

  const areas = areaIds.map((id) => {
    const area = MOCK_TECHNICAL_AREAS.find((candidate) => candidate.id === id);
    if (!area) throw new Error(`Unknown technical area: ${id}`);
    return area.name;
  });

  updateMentorParticipation({ areas });
}
