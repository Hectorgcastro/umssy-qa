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
    const [currentStep, setCurrentStep] = useState(1);
    const [conditions, setConditions] = useState<VacancyConditions>(initialConditions);

    function updateField(field: keyof VacancyConditions, value: string) {
        setConditions((prev) => ({ ...prev, [field]: value }));
    }

    function selectModality(modality: Modality) {
        setConditions((prev) => ({ ...prev, modality }));
    }

    function goNext() {
        setCurrentStep((step) => Math.min(step + 1, 3));
    }

    return { currentStep, conditions, updateField, selectModality, goNext };
}