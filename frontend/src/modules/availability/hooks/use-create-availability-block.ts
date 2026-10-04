"use client";

import { useState } from "react";
import { availabilityApi } from "../services/availability.api";
import type { AvailabilityBlock } from "../types/availability-block.types";
import type { CreateAvailabilityBlockInput } from "../types/create-availability-block-input.types";

export function useCreateAvailabilityBlock() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBlock = async (input: CreateAvailabilityBlockInput): Promise<AvailabilityBlock | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await availabilityApi.createAvailabilityBlock(input);
    } catch {
      setError("Error al crear el bloque de disponibilidad");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createBlock, isSubmitting, error };
}
