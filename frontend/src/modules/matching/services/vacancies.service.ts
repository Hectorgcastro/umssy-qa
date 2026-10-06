import { apiClient } from "@/shared/services/api-client";
import type { ApiResponse } from "@/modules/profile/types/api-response.types";
import type { Vacancy } from "../types/vacancy.types";
import type { VacanciesPage } from "../types/vacancies-page.types";
import {
  VACANCIES_ENDPOINT,
  VACANCIES_PAGE_SIZE,
} from "../constants/vacancies.constants";

export const vacanciesService = {
  async list(page: number): Promise<VacanciesPage> {
    const { data } = await apiClient.get<ApiResponse<VacanciesPage>>(
      VACANCIES_ENDPOINT,
      { params: { page, limit: VACANCIES_PAGE_SIZE } },
    );
    return data.data;
  },
  async detail(id: string): Promise<Vacancy> {
    const { data } = await apiClient.get<ApiResponse<Vacancy>>(
      `${VACANCIES_ENDPOINT}/${encodeURIComponent(id)}`,
    );
    return data.data;
  },
};
