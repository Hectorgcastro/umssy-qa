"use client";

import { useState } from "react";
import { useAvailability } from "../hooks/use-availability";
import type { CreateAvailabilityBlockInput } from "../types/availability";

export function NewAvailabilityView() {
  const { createBlock, mutationError } = useAvailability();
  const [formData, setFormData] = useState<CreateAvailabilityBlockInput>({
    mentorId: "",
    startAt: "",
    endAt: "",
    repeatUntil: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "startAt" || name === "endAt") {
      setSubmitError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.mentorId || !formData.startAt || !formData.endAt) {
      setSubmitError("Todos los campos obligatorios deben completarse");
      return false;
    }
    const start = new Date(formData.startAt).getTime();
    const end = new Date(formData.endAt).getTime();
    if (end <= start) {
      setSubmitError("La hora de fin debe ser posterior a la hora de inicio");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    const input: CreateAvailabilityBlockInput = {
      mentorId: formData.mentorId,
      startAt: formData.startAt,
      endAt: formData.endAt,
      repeatUntil: formData.repeatUntil || undefined,
    };

    const result = await createBlock(input);
    setIsSubmitting(false);

    if (result) {
      setSubmitSuccess(true);
      setFormData({ mentorId: "", startAt: "", endAt: "", repeatUntil: "" });
    } else {
      setSubmitError(mutationError || "Error al crear el bloque de disponibilidad");
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Bloque de Disponibilidad</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="mentorId" className="block text-sm font-medium mb-1">ID del Mentor</label>
          <input
            type="text"
            id="mentorId"
            data-testid="mentorId-input"
            name="mentorId"
            value={formData.mentorId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="startAt" className="block text-sm font-medium mb-1">Hora de Inicio</label>
          <input
            type="datetime-local"
            id="startAt"
            data-testid="startAt-input"
            name="startAt"
            value={formData.startAt}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="endAt" className="block text-sm font-medium mb-1">Hora de Fin</label>
          <input
            type="datetime-local"
            id="endAt"
            data-testid="endAt-input"
            name="endAt"
            value={formData.endAt}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="repeatUntil" className="block text-sm font-medium mb-1">Repetir Hasta (opcional)</label>
          <input
            type="date"
            id="repeatUntil"
            data-testid="repeatUntil-input"
            name="repeatUntil"
            value={formData.repeatUntil}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {submitError && <p className="text-red-500">{submitError}</p>}
        {submitSuccess && <p className="text-green-500">¡Bloque de disponibilidad creado exitosamente!</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isSubmitting ? "Creando..." : "Crear"}
        </button>
      </form>
    </div>
  );
}
