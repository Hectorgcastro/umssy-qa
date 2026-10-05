"use client";

import type { FormEvent } from "react";
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
import { PersonalDataField } from "./personal-data-field";

export function PersonalDataForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: conectar el guardado del borrador (#503)
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

      <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-x-8 2xl:gap-y-6">
        <PersonalDataField
          id="firstName"
          label="Nombres"
          autoComplete="given-name"
          placeholder="Ingresa tus nombres"
        />

        <PersonalDataField
          id="lastName"
          label="Apellidos"
          autoComplete="family-name"
          placeholder="Ingresa tus apellidos"
        />

        <div className="flex gap-2">
          <PersonalDataField
            id="idCardNumber"
            label="Carnet de identidad"
            inputMode="numeric"
            maxLength={20}
            placeholder="Ej. 7845123"
            className="min-w-0 flex-1"
          />

          <div className="w-24 shrink-0">
            <Label htmlFor="idCardIssuedIn" className="mb-1.5 text-[12.5px] font-semibold text-ink 2xl:text-base">
              Expedido
            </Label>
            <Select name="idCardIssuedIn">
              <SelectTrigger
                id="idCardIssuedIn"
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

        <PersonalDataField
          id="sisCode"
          label="Código SIS"
          help="Figura en tu carnet universitario o en tu kárdex."
          inputMode="numeric"
          maxLength={20}
          placeholder="Ej. 201904512"
        />

        <PersonalDataField
          id="email"
          label="Correo electrónico"
          help="Aquí te enviaremos el resultado y el código de activación."
          icon={<Mail aria-hidden="true" className="size-4" />}
          type="email"
          autoComplete="email"
          placeholder="correo@ejemplo.com"
        />

        <PersonalDataField
          id="phone"
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

        <PersonalDataField id="birthDate" label="Fecha de nacimiento" type="date" autoComplete="bday" />

        <PersonalDataField
          id="graduationYear"
          label="Año de titulación"
          inputMode="numeric"
          maxLength={4}
          placeholder="Ej. 2024"
        />

        <div className="md:col-span-2">
          <Label htmlFor="career" className="mb-1.5 text-[12.5px] font-semibold text-ink 2xl:text-base">
            Carrera
          </Label>
          <Select name="career">
            <SelectTrigger
              id="career"
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
        </div>

        <div className="flex justify-end border-t border-border pt-5 md:col-span-2">
          <Button type="submit" className="h-[42px] 2xl:h-12 rounded-md bg-ink px-5 text-[14.5px] font-semibold text-surface hover:bg-ink/90">
            Continuar al siguiente paso
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </form>
    </div>
  );
}
