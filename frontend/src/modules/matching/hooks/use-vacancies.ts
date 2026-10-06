"use client";

import { useQuery } from "@tanstack/react-query";
import { VACANCIES_QUERY_KEY } from "../constants/vacancies.constants";
import { vacanciesService } from "../services/vacancies.service";

export function useVacancies(page: number) {
  return useQuery({
    queryKey: [...VACANCIES_QUERY_KEY, page],
    queryFn: () => vacanciesService.list(page),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useVacancy(id: string) {
  return useQuery({
    queryKey: [...VACANCIES_QUERY_KEY, "detail", id],
    queryFn: () => vacanciesService.detail(id),
    staleTime: 0,
    refetchOnMount: "always",
  });
}
