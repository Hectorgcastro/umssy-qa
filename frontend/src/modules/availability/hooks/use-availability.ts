"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { availabilityApi } from "../services/availability.api";
import type { AvailabilityBlock, AvailabilityFilters, CreateAvailabilityBlockInput } from "../types/availability";

export function useAvailability(filters?: AvailabilityFilters) {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const filtersRef = useRef(filters);
  const initialFetchRef = useRef(true);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchBlocks = useCallback(async (resetState = true) => {
    if (!mountedRef.current) return;
    if (resetState) {
      setIsLoading(true);
      setFetchError(null);
    }
    try {
      const data = await availabilityApi.getAvailabilityBlocks(filtersRef.current);
      if (mountedRef.current) setBlocks(data);
    } catch {
      if (mountedRef.current) setFetchError("Error al obtener los bloques de disponibilidad");
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (initialFetchRef.current) {
      initialFetchRef.current = false;
      fetchBlocks();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [fetchBlocks]);

  const createBlock = async (input: CreateAvailabilityBlockInput): Promise<AvailabilityBlock | null> => {
    setMutationError(null);
    try {
      const newBlock = await availabilityApi.createAvailabilityBlock(input);
      setBlocks((prev) => [...prev, newBlock]);
      return newBlock;
    } catch {
      setMutationError("Error al crear el bloque de disponibilidad");
      return null;
    }
  };

  const updateBlock = async (id: string, input: Partial<CreateAvailabilityBlockInput>): Promise<AvailabilityBlock | null> => {
    setMutationError(null);
    try {
      const updatedBlock = await availabilityApi.updateAvailabilityBlock(id, input);
      setBlocks((prev) => prev.map((block) => (block.id === id ? updatedBlock : block)));
      return updatedBlock;
    } catch {
      setMutationError("Error al actualizar el bloque de disponibilidad");
      return null;
    }
  };

  const deleteBlock = async (id: string): Promise<boolean> => {
    setMutationError(null);
    try {
      await availabilityApi.deleteAvailabilityBlock(id);
      setBlocks((prev) => prev.filter((block) => block.id !== id));
      return true;
    } catch {
      setMutationError("Error al eliminar el bloque de disponibilidad");
      return false;
    }
  };

  return {
    blocks,
    isLoading,
    error: fetchError,
    mutationError,
    refetch: () => fetchBlocks(true),
    createBlock,
    updateBlock,
    deleteBlock,
  };
}
