"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrientationTypes } from "../services/orientation-type.service";
import { getTechnicalAreas } from "../services/technical-area.service";

export function useMentorshipCatalogs() {
  const technicalAreasQuery = useQuery({
    queryKey: ["mentorship", "technical-areas"],
    queryFn: getTechnicalAreas,
  });

  const orientationTypesQuery = useQuery({
    queryKey: ["mentorship", "orientation-types"],
    queryFn: getOrientationTypes,
  });

  return {
    technicalAreas: technicalAreasQuery.data ?? [],
    orientationTypes: orientationTypesQuery.data ?? [],
    isLoading:
      technicalAreasQuery.isLoading || orientationTypesQuery.isLoading,
    isError: technicalAreasQuery.isError || orientationTypesQuery.isError,
    error: technicalAreasQuery.error ?? orientationTypesQuery.error ?? null,
    retry: () => {
      void technicalAreasQuery.refetch();
      void orientationTypesQuery.refetch();
    },
  };
}
