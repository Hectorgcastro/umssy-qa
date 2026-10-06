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
    // NUEVOS CAMPOS PASO 2
    description: string;
    skills: string[]; // Guardamos las habilidades como un array de strings
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
    // VALORES INICIALES PASO 2
    description: "",
    skills: [],
};

export function useJobOfferForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [conditions, setConditions] = useState<VacancyConditions>(initialConditions);

    // Como skills es un array, necesitamos actualizar el tipado de updateField
    function updateField<Field extends keyof VacancyConditions>(
        field: Field,
        value: VacancyConditions[Field],
    ) {
        setConditions((prev) => ({ ...prev, [field]: value }));
    }

    function selectModality(modality: Modality) {
        setConditions((prev) => ({ ...prev, modality }));
    }

    function goNext() {
        setCurrentStep((step) => Math.min(step + 1, 3));
    }
    
    // NUEVA FUNCIÓN PARA VOLVER ATRÁS
    function goBack() {
        setCurrentStep((step) => Math.max(step - 1, 1));
    }

    return { currentStep, conditions, updateField, selectModality, goNext, goBack };
}