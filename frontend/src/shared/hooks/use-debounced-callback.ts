"use client";

import { useEffect, useRef } from "react";

// Ejecuta el callback solo cuando el usuario deja de escribir durante `delayMs`.
export function useDebouncedCallback<TValue>(
  callback: (value: TValue) => void,
  delayMs: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (value: TValue) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(value), delayMs);
  };
}
