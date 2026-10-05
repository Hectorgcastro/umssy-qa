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

export type VacancyErrors = Partial<Record<keyof VacancyConditions, string>>;
const GOOGLE_MAPS_LINK_REGEX =/^https:\/\/(www\.)?(maps\.google\.com|google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/i;

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
    const [errors, setErrors] = useState<VacancyErrors>({});

    function updateField(field: keyof VacancyConditions, value: string) {
        setConditions((prev) => ({ ...prev, [field]: value }));
    }

    function selectModality(modality: Modality) {
        setConditions((prev) => ({ ...prev, modality }));
    }

    function validateMapsLink(){
        if(conditions.mapsLink.trim() == "") return;
        const isValid = GOOGLE_MAPS_LINK_REGEX.test(conditions.mapsLink.trim());
        setErrors((prev) => ({...prev, mapsLink: isValid ? undefined: "Ingresa un enlace valido de Google Maps",}));
    }

    function goNext() {
        setCurrentStep((step) => Math.min(step + 1, 3));
    }

    return { currentStep, conditions, errors, updateField, selectModality,validateMapsLink,  goNext, };
}