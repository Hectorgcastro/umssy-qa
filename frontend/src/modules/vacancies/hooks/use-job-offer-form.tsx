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

const REQUIRED_FIELDS: (keyof VacancyConditions)[] = [
    "title",
    "modality",
    "mapsLink",
    "contractType",
    "category",
    "vacancyCount",
    "languages",
];

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

function isFieldEmpty(field: keyof VacancyConditions, conditions: VacancyConditions) {
    if (field === "modality") return conditions.modality === null;
    const value = conditions[field] as string;
    return value.trim() === "";
}

export function useJobOfferForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [conditions, setConditions] = useState<VacancyConditions>(initialConditions);
    const [errors, setErrors] = useState<VacancyErrors>({});

    function updateField(field: keyof VacancyConditions, value: string) {
    setConditions((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
    });
}

    function selectModality(modality: Modality) {
    setConditions((prev) => ({ ...prev, modality }));
    setErrors((prev) => {
        if (!prev.modality) return prev;
        const next = { ...prev };
        delete next.modality;
        return next;
    });
}

    function validateMapsLink(){
        if(conditions.mapsLink.trim() == "") return;
        const isValid = GOOGLE_MAPS_LINK_REGEX.test(conditions.mapsLink.trim());
        setErrors((prev) => ({...prev, mapsLink: isValid ? undefined: "Ingresa un enlace valido de Google Maps",}));
    }

    function goNext() {
        setCurrentStep((step) => Math.min(step + 1, 3));
    }

    function handleContinue(){
        const firstEmptyField = REQUIRED_FIELDS.find((field) => isFieldEmpty(field, conditions));

        if (firstEmptyField) {
            setErrors((prev) => ({ ...prev, [firstEmptyField]: "Este campo es obligatorio" }));

            const el = document.getElementById(firstEmptyField);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.focus();
            
    }
    return;
}
goNext();
    }
    return { currentStep, conditions, errors, updateField, selectModality,validateMapsLink, handleContinue, goNext, };
}