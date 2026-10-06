"use client";

import { useState } from "react";

export type Modality = "Presencial" | "Remoto" | "Hibrido";

export interface VacancyConditions {
    title: string;
    modality: Modality | null;
    mapsLink: string;
    contractType: string;
    category: string;
    vacancyCount: string;
    salary: string;
    languages: string;
}

const initialConditions: VacancyConditions = {
    title: "",
    modality: null,
    mapsLink: "",
    contractType: "",
    category: "",
    vacancyCount: "",
    salary: "",
    languages: "",
};

export function useJobOfferForm() {
    const [currentStep, setCurrentStep] = useState(3);
    const [conditions, setConditions] = useState<VacancyConditions>(initialConditions);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function updateField(field: keyof VacancyConditions, value: string) {
        setConditions((prev) => ({ ...prev, [field]: value }));
    }

    function selectModality(modality: Modality) {
        setConditions((prev) => ({ ...prev, modality }));
    }

    function goNext() {
        setCurrentStep((step) => Math.min(step + 1, 3));
    }

    function goBack() {
        setCurrentStep((step) => Math.max(step - 1, 1));
    }

    async function submitJobOffer(empresaId: string) {
        setIsLoading(true);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; 
            const response = await fetch(`${apiUrl}/api/v1/empresas/${empresaId}/ofertas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conditions),
            });

            if (!response.ok) {
                if (response.status === 422) {
                    throw new Error("Error de validación: Revisa los datos de la oferta."); 
                } else if (response.status === 500) {
                    throw new Error("Error interno del servidor. Por favor, intenta de nuevo más tarde.");
                } else {
                    throw new Error(`Error del servidor: ${response.statusText}`);
                }
            }

            const data = await response.json();
            setIsLoading(false);
            return data;

        } catch (err: any) {
            setIsLoading(false);
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                setError("Error de red: No se pudo conectar al servidor. Revisa tu conexión a internet.");
            } else {
                setError(err.message || "Ocurrió un error al enviar la oferta.");
            }
            throw err; 
        }
    }

    return { currentStep, conditions, isLoading, error, updateField, selectModality, goNext, goBack, submitJobOffer };
}