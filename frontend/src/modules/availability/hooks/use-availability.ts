"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { availabilityApi } from "../services/availability.api";
import type { AvailabilityBlock, AvailabilityFilters, CreateAvailabilityBlockInput } from "../types/availability";

export function useAvailability(filters?: AvailabilityFilters) {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchBlocks = useCallback(async () => {
    if (!mountedRef.current) return;
    try {
      const data = await availabilityApi.getAvailabilityBlocks(filtersRef.current);
      if (mountedRef.current) setBlocks(data);
    } catch {
      if (mountedRef.current) setError("Failed to fetch availability blocks");
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchBlocks();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchBlocks]);

  const createBlock = async (input: CreateAvailabilityBlockInput): Promise<AvailabilityBlock | null> => {
    try {
      const newBlock = await availabilityApi.createAvailabilityBlock(input);
      setBlocks((prev) => [...prev, newBlock]);
      return newBlock;
    } catch {
      setError("Failed to create availability block");
      return null;
    }
  };

  const updateBlock = async (id: string, input: Partial<CreateAvailabilityBlockInput>): Promise<AvailabilityBlock | null> => {
    try {
      const updatedBlock = await availabilityApi.updateAvailabilityBlock(id, input);
      setBlocks((prev) => prev.map((block) => (block.id === id ? updatedBlock : block)));
      return updatedBlock;
    } catch {
      setError("Failed to update availability block");
      return null;
    }
  };

  const deleteBlock = async (id: string): Promise<boolean> => {
    try {
      await availabilityApi.deleteAvailabilityBlock(id);
      setBlocks((prev) => prev.filter((block) => block.id !== id));
      return true;
    } catch {
      setError("Failed to delete availability block");
      return false;
    }
  };

  return {
    blocks,
    isLoading,
    error,
    refetch: fetchBlocks,
    createBlock,
    updateBlock,
    deleteBlock,
  };
}

export function useAvailabilityBlock(id: string) {
  const [block, setBlock] = useState<AvailabilityBlock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!id) return;
    mountedRef.current = true;
    availabilityApi
      .getAvailabilityBlockById(id)
      .then((data) => {
        if (mountedRef.current) {
          setBlock(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mountedRef.current) {
          setError("Failed to fetch availability block");
          setIsLoading(false);
        }
      });
    return () => {
      mountedRef.current = false;
    };
  }, [id]);

  return { block, isLoading, error };
}
