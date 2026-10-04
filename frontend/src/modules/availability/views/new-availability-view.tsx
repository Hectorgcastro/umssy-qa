"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EMPTY_FORM } from "../constants/availability.constants";
import { useCreateAvailabilityBlock } from "../hooks/use-create-availability-block";
import type { CreateAvailabilityBlockInput } from "../types/create-availability-block-input.types";

export function NewAvailabilityView() {
  const { createBlock, isSubmitting, error: createError } = useCreateAvailabilityBlock();
  const [formData, setFormData] = useState<CreateAvailabilityBlockInput>(EMPTY_FORM);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.startAt || !formData.endAt) {
      return "Todos los campos obligatorios deben completarse";
    }
    const start = new Date(formData.startAt).getTime();
    const end = new Date(formData.endAt).getTime();
    if (end <= start) {
      return "La hora de fin debe ser posterior a la hora de inicio";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    const formError = validateForm();
    setValidationError(formError);
    if (formError) return;

    const result = await createBlock(formData);

    if (result) {
      setSubmitSuccess(true);
      setFormData(EMPTY_FORM);
    }
  };

  const submitError = validationError ?? createError;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Bloque de Disponibilidad</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="startAt" className="mb-1 block text-sm font-medium text-foreground">Hora de Inicio</label>
          <Input
            type="datetime-local"
            id="startAt"
            data-testid="startAt-input"
            name="startAt"
            value={formData.startAt}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="endAt" className="mb-1 block text-sm font-medium text-foreground">Hora de Fin</label>
          <Input
            type="datetime-local"
            id="endAt"
            data-testid="endAt-input"
            name="endAt"
            value={formData.endAt}
            onChange={handleChange}
            required
          />
        </div>
        {submitError && <p className="text-sm text-destructive">{submitError}</p>}
        {submitSuccess && <p className="text-sm text-primary">¡Bloque de disponibilidad creado exitosamente!</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear"}
        </Button>
      </form>
    </div>
  );
}
