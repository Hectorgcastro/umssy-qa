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
    description: string;
    skills: string[];
}

export type UpdateVacancyField = <Field extends keyof VacancyConditions>(
    field: Field,
    value: VacancyConditions[Field],
) => void;

const initialConditions: VacancyConditions = {
    title: "",
    modality: null,
    mapsLink: "",
    contractType: "",
    category: "",
    vacancyCount: "",
    salary: "",
    languages: "",
    description: "",
    skills: [],
};

export function useJobOfferForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [conditions, setConditions] = useState<VacancyConditions>(initialConditions);
    const updateField: UpdateVacancyField = (field, value) => {
        setConditions((prev) => ({ ...prev, [field]: value }));
    };

    function selectModality(modality: Modality) {
        setConditions((prev) => ({ ...prev, modality }));
    }

    function goNext() {
        setCurrentStep((step) => Math.min(step + 1, 3));
    }
    
    function goBack() {
        setCurrentStep((step) => Math.max(step - 1, 1));
    }

    return { currentStep, conditions, updateField, selectModality, goNext, goBack };
}