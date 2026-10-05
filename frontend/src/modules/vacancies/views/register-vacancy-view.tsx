"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { VacancyStepper } from "../components/vacancy-stepper";
import { InformationStep } from "../components/information-step";
import { useJobOfferForm } from "../hooks/use-job-offer-form";

export function RegisterVacancyView() {
    const { currentStep, conditions, updateField, selectModality } = useJobOfferForm();

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            <Link href="/vacancies"
              className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-ink">
            <ChevronLeft className="h-4 w-4" />Volver a mis vacantes
            </Link>

            <h1 className="mt-3 text-[30px] font-extrabold text-ink">Registrar nueva vacante</h1>
            <p className="mt-1 text-[15px] font-normal text-text-secondary">
                Completa la informacion de la oferta para publicarla en la plataforma.
            </p>

            <VacancyStepper currentStep={currentStep} />
            <InformationStep conditions={conditions} updateField={updateField} selectModality={selectModality} />
        </div>
    );
}
