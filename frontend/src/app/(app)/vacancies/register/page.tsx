"use client";

import { RecruitersBaseView } from "@/modules/recruiters";
import { VacancyStepper } from "@/modules/vacancies/components/vacancy-stepper";
import { InformationStep } from "@/modules/vacancies/components/information-step";
import { useJobOfferForm } from "@/modules/vacancies/hooks/use-job-offer-form";

export default function RegisterPage() {
  const { conditions, updateField, selectModality } = useJobOfferForm();
  return (
    <RecruitersBaseView>
      <VacancyStepper currentStep={1} />
      <InformationStep
        conditions={conditions}
        updateField={updateField}
        selectModality={selectModality}
      />
    </RecruitersBaseView>
  );
}
