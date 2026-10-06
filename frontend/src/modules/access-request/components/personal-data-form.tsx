"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ChevronRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CAREERS } from "../constants/careers.constants";
import { ID_CARD_ISSUED_IN } from "../constants/id-card-issued-in.constants";
import { useAccessRequestForm } from "../contexts/access-request-context";
import type { PersonalDataFieldName } from "../types/access-request.types";
import { ClearDataDialog } from "./clear-data-dialog";
import { FieldError } from "./field-error";
import { PersonalDataField } from "./personal-data-field";
import { RequiredMark } from "./required-mark";

// Orden visual del formulario: el primer campo con error es el que recibe el foco
const FIELD_ORDER: readonly PersonalDataFieldName[] = [
  "firstName",
  "lastName",
  "idCardNumber",
  "idCardIssuedIn",
  "sisCode",
  "email",
  "phone",
  "birthDate",
  "graduationYear",
  "career",
];

export function PersonalDataForm() {
  const { values, status, fieldErrors, notice, setValue, submit } = useAccessRequestForm();
  const isSubmitting = status === "submitting";
  // Cada envío terminado incrementa el contador; el efecto enfoca el primer error solo cuando cambia
  const [submitCount, setSubmitCount] = useState(0);
  const handledCount = useRef(0);

  useEffect(() => {
    if (submitCount === handledCount.current) return;
    handledCount.current = submitCount;
    const firstWithError = FIELD_ORDER.find((field) => fieldErrors[field]);
    // Los ids de los controles (inputs y disparadores de los selects) son los nombres de los campos
    if (firstWithError) document.getElementById(firstWithError)?.focus();
  }, [submitCount, fieldErrors]);

  async function submitAndFocus() {
    await submit();
    setSubmitCount((count) => count + 1);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitAndFocus();
  }

  // Props comunes de los campos de texto: valor controlado, cambio y error propio
  function bind(field: PersonalDataFieldName) {
    return {
      value: values[field],
      error: fieldErrors[field],
      onChange: (event: ChangeEvent<HTMLInputElement>) => setValue(field, event.target.value),
    };
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink 2xl:text-4xl">
          Solicita tu acceso a la comunidad
        </h1>
        <p className="max-w-155 text-[15px] text-text-secondary 2xl:text-lg">
          La carrera verifica cada solicitud con tu documento académico. Así la comunidad reúne
          solo a titulados reales de Ingeniería de Sistemas e Informática.
        </p>
      </div>

      <p className="text-[12.5px] text-text-secondary 2xl:text-base">
        <span aria-hidden="true" className="text-accent">
          *
        </span>{" "}
        Campo obligatorio
      </p>

      <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-x-8 2xl:gap-y-6">
        <PersonalDataField
          id="firstName"
          {...bind("firstName")}
          label="Nombres"
          isRequired
          autoComplete="given-name"
          placeholder="Ingresa tus nombres"
        />

        <PersonalDataField
          id="lastName"
          {...bind("lastName")}
          label="Apellidos"
          isRequired
          autoComplete="family-name"
          placeholder="Ingresa tus apellidos"
        />

        <div>
          <div className="flex gap-2">
            <PersonalDataField
              id="idCardNumber"
              {...bind("idCardNumber")}
              label="Carnet de identidad"
              isRequired
              inputMode="numeric"
              maxLength={20}
              placeholder="Ej. 7845123"
              className="min-w-0 flex-1"
            />

            <div className="w-24 shrink-0">
              <Label htmlFor="idCardIssuedIn" className="mb-1.5 text-[12.5px] font-semibold text-ink 2xl:text-base">
                Expedido
                <RequiredMark />
              </Label>
              <Select
                name="idCardIssuedIn"
                value={values.idCardIssuedIn || null}
                onValueChange={(value) => setValue("idCardIssuedIn", value ?? "")}
              >
                <SelectTrigger
                  id="idCardIssuedIn"
                  aria-required="true"
                  aria-invalid={fieldErrors.idCardIssuedIn ? true : undefined}
                  aria-describedby={fieldErrors.idCardIssuedIn ? "idCardIssuedIn-error" : undefined}
                  className="w-full rounded-md border-border bg-surface px-3 text-[15px] text-ink focus-visible:border-accent focus-visible:ring-interaction data-[size=default]:h-[42px] 2xl:text-base 2xl:data-[size=default]:h-12"
                >
                  <SelectValue placeholder="Elegir" />
                </SelectTrigger>
                <SelectContent>
                  {ID_CARD_ISSUED_IN.map((code) => (
                    <SelectItem
                      key={code}
                      value={code}
                      className="focus:bg-muted focus:text-foreground"
                    >
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <FieldError id="idCardIssuedIn-error" message={fieldErrors.idCardIssuedIn} />
        </div>

        <PersonalDataField
          id="sisCode"
          {...bind("sisCode")}
          label="Código SIS"
          isRequired
          help="Figura en tu carnet universitario o en tu kárdex."
          inputMode="numeric"
          maxLength={20}
          placeholder="Ej. 201904512"
        />

        <PersonalDataField
          id="email"
          {...bind("email")}
          label="Correo electrónico"
          isRequired
          help="Aquí te enviaremos el resultado y el código de activación."
          icon={<Mail aria-hidden="true" className="size-4" />}
          type="email"
          autoComplete="email"
          placeholder="correo@ejemplo.com"
        />

        <PersonalDataField
          id="phone"
          {...bind("phone")}
          label={
            <>
              Teléfono <span className="font-normal text-text-secondary">(opcional)</span>
            </>
          }
          type="tel"
          inputMode="tel"
          maxLength={8}
          autoComplete="tel"
          placeholder="Ej. 70712345"
        />

        <PersonalDataField
          id="birthDate"
          {...bind("birthDate")}
          label="Fecha de nacimiento"
          isRequired
          type="date"
          autoComplete="bday"
        />

        <PersonalDataField
          id="graduationYear"
          {...bind("graduationYear")}
          label="Año de titulación"
          isRequired
          inputMode="numeric"
          maxLength={4}
          placeholder="Ej. 2024"
        />

        <div className="md:col-span-2">
          <Label htmlFor="career" className="mb-1.5 text-[12.5px] font-semibold text-ink 2xl:text-base">
            Carrera
            <RequiredMark />
          </Label>
          <Select
            name="career"
            value={values.career || null}
            onValueChange={(value) => setValue("career", value ?? "")}
          >
            <SelectTrigger
              id="career"
              aria-required="true"
              aria-invalid={fieldErrors.career ? true : undefined}
              aria-describedby={fieldErrors.career ? "career-error" : undefined}
              className="w-full rounded-md border-border bg-surface px-3 text-[15px] text-ink focus-visible:border-accent focus-visible:ring-interaction data-[size=default]:h-[42px] 2xl:text-base 2xl:data-[size=default]:h-12"
            >
              <SelectValue placeholder="Selecciona tu carrera" />
            </SelectTrigger>
            <SelectContent>
              {CAREERS.map((career) => (
                <SelectItem
                  key={career}
                  value={career}
                  className="focus:bg-muted focus:text-foreground"
                >
                  {career}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError id="career-error" message={fieldErrors.career} />
        </div>

        <div className="flex flex-col items-end gap-3 border-t border-border pt-5 md:col-span-2">
          {notice ? (
            <p
              role={notice.type === "error" ? "alert" : "status"}
              className={`self-stretch text-[13.5px] 2xl:text-base ${
                notice.type === "error" ? "text-destructive" : "text-ink"
              }`}
            >
              {notice.text}
            </p>
          ) : null}
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <ClearDataDialog />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-[42px] 2xl:h-12 rounded-md bg-ink px-5 text-[14.5px] font-semibold text-surface hover:bg-ink/90"
            >
              {isSubmitting ? (
                "Guardando..."
              ) : (
                <>
                  Continuar al siguiente paso
                  <ChevronRight aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
