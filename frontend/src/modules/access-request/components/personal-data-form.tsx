import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const expeditionOptions = [
  "CB",
  "LP",
  "SC",
  "OR",
  "PT",
  "CH",
  "TJ",
  "BE",
  "PD",
];

export function PersonalDataForm() {
  return (
    <div className="w-full max-w-4xl">
      <div className="mb-8">
        <p className="text-sm font-semibold text-accent">
          Paso 1 de 4
        </p>

        <h1 className="mt-2 text-3xl font-bold text-ink">
          Tus datos personales
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          Ingresa tus datos personales y académicos para iniciar tu solicitud.
        </p>
      </div>

      <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="firstNames"
            className="text-sm font-semibold text-ink"
          >
            Nombres <span className="text-accent">*</span>
          </Label>

          <Input
            id="firstNames"
            name="firstNames"
            placeholder="Ingresa tus nombres"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="lastNames"
            className="text-sm font-semibold text-ink"
          >
            Apellidos <span className="text-accent">*</span>
          </Label>

          <Input
            id="lastNames"
            name="lastNames"
            placeholder="Ingresa tus apellidos"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="identityCard"
            className="text-sm font-semibold text-ink"
          >
            Carnet de identidad <span className="text-accent">*</span>
          </Label>

          <Input
            id="identityCard"
            name="identityCard"
            placeholder="Ej. 12345678"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="expedition"
            className="text-sm font-semibold text-ink"
          >
            Expedido <span className="text-accent">*</span>
          </Label>

          <Select>
            <SelectTrigger id="expedition" className="w-full">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>

            <SelectContent>
              {expeditionOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="sisCode"
            className="text-sm font-semibold text-ink"
          >
            Código SIS <span className="text-accent">*</span>
          </Label>

          <Input
            id="sisCode"
            name="sisCode"
            placeholder="Ingresa tu código SIS"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-ink"
          >
            Correo electrónico <span className="text-accent">*</span>
          </Label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="text-sm font-semibold text-ink"
          >
            Teléfono{" "}
            <span className="font-normal text-text-secondary">
              (opcional)
            </span>
          </Label>

          <Input
            id="phone"
            name="phone"
            placeholder="Ej. 70707070"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="birthDate"
            className="text-sm font-semibold text-ink"
          >
            Fecha de nacimiento <span className="text-accent">*</span>
          </Label>

          <Input
            id="birthDate"
            name="birthDate"
            type="date"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="admissionYear"
            className="text-sm font-semibold text-ink"
          >
            Año de ingreso a la UMSS{" "}
            <span className="text-accent">*</span>
          </Label>

          <Input
            id="admissionYear"
            name="admissionYear"
            type="number"
            placeholder="Ej. 2022"
          />
        </div>

        <div className="flex justify-end gap-3 md:col-span-2">
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Cancelar
          </Link>

          <Button
            type="button"
            className="bg-accent px-6 text-white hover:bg-danger"
          >
            Continuar al siguiente paso
          </Button>
        </div>
      </form>
    </div>
  );
}