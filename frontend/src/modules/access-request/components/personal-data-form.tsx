import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        <p className="text-sm font-semibold text-[#E30613]">
          Paso 1 de 4
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#0B1F2E]">
          Tus datos personales
        </h1>

        <p className="mt-2 text-sm text-[#5B6470]">
          Ingresa tus datos personales y académicos para iniciar tu solicitud.
        </p>
      </div>

      <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="firstNames"
            className="text-sm font-semibold text-[#0B1F2E]"
          >
            Nombres <span className="text-[#E30613]">*</span>
          </label>

          <Input
            id="firstNames"
            name="firstNames"
            placeholder="Ingresa tus nombres"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="lastNames"
            className="text-sm font-semibold text-[#0B1F2E]"
          >
            Apellidos <span className="text-[#E30613]">*</span>
          </label>

          <Input
            id="lastNames"
            name="lastNames"
            placeholder="Ingresa tus apellidos"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="identityCard"
            className="text-sm font-semibold text-[#0B1F2E]"
          >
            Carnet de identidad <span className="text-[#E30613]">*</span>
          </label>

          <Input
            id="identityCard"
            name="identityCard"
            placeholder="Ej. 12345678"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="expedition"
            className="text-sm font-semibold text-[#0B1F2E]"
          >
            Expedido <span className="text-[#E30613]">*</span>
          </label>

          <select
            id="expedition"
            name="expedition"
            defaultValue=""
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="" disabled>
              Selecciona
            </option>

            {expeditionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sisCode"
            className="text-sm font-semibold text-[#0B1F2E]"
          >
            Código SIS <span className="text-[#E30613]">*</span>
          </label>

          <Input
            id="sisCode"
            name="sisCode"
            placeholder="Ingresa tu código SIS"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-[#0B1F2E]"
          >
            Correo electrónico <span className="text-[#E30613]">*</span>
          </label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-sm font-semibold text-[#0B1F2E]"
          >
            Teléfono{" "}
            <span className="font-normal text-[#5B6470]">
              (opcional)
            </span>
          </label>

          <Input
            id="phone"
            name="phone"
            placeholder="Ej. 70707070"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="birthDate"
            className="text-sm font-semibold text-[#0B1F2E]"
          >
            Fecha de nacimiento <span className="text-[#E30613]">*</span>
          </label>

          <Input
            id="birthDate"
            name="birthDate"
            type="date"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="admissionYear"
            className="text-sm font-semibold text-[#0B1F2E]"
          >
            Año de ingreso a la UMSS{" "}
            <span className="text-[#E30613]">*</span>
          </label>

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
            className="bg-[#E30613] px-6 text-white hover:bg-[#B4050F]"
          >
            Continuar al siguiente paso
          </Button>
        </div>
      </form>
    </div>
  );
}