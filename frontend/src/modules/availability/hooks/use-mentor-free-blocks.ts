"use client";

import { useEffect, useRef, useState } from "react";
import { availabilityApi } from "../services/availability.api";
import type { AvailabilityBlock } from "../types/availability-block.types";
import type { WeekRange } from "@/shared/types/week-range.types";

const STALE_TIME_MS = 30_000;

type CacheEntry = {
  blocks: AvailabilityBlock[];
  fetchedAt: number;
};

export function useMentorFreeBlocks(mentorId: string, weekRange?: WeekRange) {
  const rangeKey = weekRange ? `${weekRange.startAt}|${weekRange.endAt}` : "";
  const requestKey = `${mentorId}|${rangeKey}`;

  const cacheRef = useRef(new Map<string, CacheEntry>());
  const forceRefreshRef = useRef(false);

  const [currentRequestKey, setCurrentRequestKey] = useState(requestKey);
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  if (currentRequestKey !== requestKey) {
    setCurrentRequestKey(requestKey);
    setIsLoading(true);
    setError(null);
  }

  useEffect(() => {
    let cancelled = false;
    const forceRefresh = forceRefreshRef.current;
    forceRefreshRef.current = false;

    const cached = cacheRef.current.get(requestKey);
    const isFresh =
      cached && Date.now() - cached.fetchedAt < STALE_TIME_MS;

    if (!forceRefresh && isFresh) {
      setBlocks(cached.blocks);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const request = weekRange
      ? availabilityApi.getMentorFreeBlocks(mentorId, weekRange)
      : availabilityApi.getMentorFreeBlocks(mentorId);

    request
      .then((data) => {
        if (!cancelled) {
          cacheRef.current.set(requestKey, {
            blocks: data,
            fetchedAt: Date.now(),
          });
          setBlocks(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Error al obtener los bloques de disponibilidad");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorId, rangeKey, reloadCount]);

  useEffect(() => {
    function handleFocusRegain() {
      if (document.visibilityState !== "hidden") {
        forceRefreshRef.current = true;
        setReloadCount((count) => count + 1);
      }
    }

    window.addEventListener("focus", handleFocusRegain);
    document.addEventListener("visibilitychange", handleFocusRegain);

    return () => {
      window.removeEventListener("focus", handleFocusRegain);
      document.removeEventListener("visibilitychange", handleFocusRegain);
    };
  }, []);

  return { blocks, isLoading, error };
}
