import type { Vacancy } from "./vacancy.types";

export interface VacanciesPage { items: Vacancy[]; total: number; page: number; limit: number; }
