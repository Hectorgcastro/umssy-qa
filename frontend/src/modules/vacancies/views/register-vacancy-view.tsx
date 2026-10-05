"use client";

import { VacancyStepper } from "../components/vacancy-stepper";
import { InformationStep } from "../components/information-step";
import { useJobOfferForm } from "../hooks/use-job-offer-form";

export function RegisterVacancyView() {
    const { currentStep, conditions, errors, updateField, selectModality, validateMapsLink, handleContinue } = useJobOfferForm();

    return (
        <>
            <VacancyStepper currentStep={currentStep} />
            <InformationStep conditions={conditions} errors={errors} updateField={updateField} selectModality={selectModality} validateMapsLink={validateMapsLink} onContinue={handleContinue} />
        </>
    );
}
