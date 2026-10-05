"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Modality, VacancyConditions, VacancyErrors, } from "../hooks/use-job-offer-form";

interface InformationStepProps{
  conditions: VacancyConditions;
  errors: VacancyErrors;
  updateField: (field: keyof VacancyConditions, value:string) => void;
  selectModality: (modality:Modality) => void;
  validateMapsLink: () => void;
  onContinue: () => void;
}

const MODALITIES = ["Presencial", "Remoto", "Hibrido"];
const CONTRACT_TYPES = ["Tiempo completo", "Medio tiempo", "Pasantia"];

export function InformationStep({ conditions, errors, updateField, selectModality ,validateMapsLink, onContinue }: InformationStepProps) {
  return (
    <div className="mt-6 rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-[22px] font-bold text-ink">
          Informacion y condiciones de la oferta
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="title" className="text-[12.5px] font-semibold">
            Titulo del puesto <span className="text-danger">*</span>
          </Label>
          <Input id="title" placeholder="Desarrollador Backend" className="mt-1.5" 
          value={conditions.title} onChange={(event) => updateField("title", event.target.value)}/>
          {errors.title && (<p className="mt-1 text-xs font-semibold text-danger">{errors.title}</p>)}
        </div>

        <div id="modality" tabIndex={-1}>
          <Label className="text-[12.5px] font-semibold">
            Modalidad  <span className="text-danger">*</span>
          </Label>
          <div className={errors.modality ? "mt-1.5 grid grid-cols-3 gap-2 rounded-md ring-2 ring-danger" : "mt-1.5 grid grid-cols-3 gap-2"}>
            {MODALITIES.map((modality) => (
              <button
                key={modality}
                type="button"
                onClick={() => selectModality(modality as Modality)}
                className={conditions.modality === modality 
                  ? "rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white" 
                  : "rounded-md border border-border px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-soft"}
                >{modality}
              </button>
            ))}
          </div>
          {errors.modality && (<p className="mt-1 text-xs font-semibold text-danger">{errors.modality}</p>)}
        </div>

        <div>
          <Label htmlFor="mapsLink" className="text-[12.5px] font-semibold">
            Enlace de Google Maps <span className="text-danger">*</span>
          </Label>
          <Input
            id="mapsLink" placeholder="https://maps.google.com/?q=..." className="mt-1.5"
              value={conditions.mapsLink} onChange={(event) => updateField("mapsLink" , event.target.value)} onBlur={validateMapsLink}/>
              {errors.mapsLink && (<p className="mt-1 text-xs font-semibold text-danger">{errors.mapsLink}</p>)}
        </div>

        <div>
          <Label htmlFor="contractType" className="text-[12.5px] font-semibold">
            Tipo de contrato <span className="text-danger">*</span>
          </Label>
          <Select value={conditions.contractType} onValueChange={(value) => updateField("contractType", value ?? "")}>
            <SelectTrigger id="contractType" className={errors.contractType ? "mt-1.5 w-full border-danger" : "mt-1.5 w-full"}>
              <SelectValue  placeholder="Selecciona una opcion" />
            </SelectTrigger>
            <SelectContent>
              {CONTRACT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.contractType && (<p className="mt-1 text-xs font-semibold text-danger">{errors.contractType}</p>)}
        </div>

         <div>
          <Label htmlFor="category" className="text-[12.5px] font-semibold">
            Categoria <span className="text-danger">*</span>
          </Label>
          <Input id="category" placeholder="Tecnologia" className={errors.category ? "mt-1.5 border-danger" : "mt-1.5"} 
          value={conditions.category} onChange={(event) => updateField("category", event.target.value)} />
          {errors.category && (<p className="mt-1 text-xs font-semibold text-danger">{errors.category}</p>)}
        </div>

        <div>
          <Label htmlFor="vacancyCount" className="text-[12.5px] font-semibold">
            Numero de vacantes <span className="text-danger">*</span>
          </Label>
          <Input id="vacancyCount" placeholder="1" className={errors.vacancyCount ? "mt-1.5 border-danger" : "mt-1.5"} 
          value={conditions.vacancyCount} onChange={(event) => updateField("vacancyCount", event.target.value)}/>
          {errors.vacancyCount && (<p className="mt-1 text-xs font-semibold text-danger">{errors.vacancyCount}</p>)}
        </div>

       <div>
          <Label htmlFor="salary" className="text-[12.5px] font-semibold">Salario</Label>
          <Input id="salary" placeholder="Bs 6.500 - 8.000" className="mt-1.5" 
          value={conditions.salary} onChange={(event) => updateField("salary", event.target.value)} />
        </div>

        <div>
          <Label htmlFor="languages" className="text-[12.5px] font-semibold">
            Idiomas <span className="text-danger">*</span>
          </Label>
          <Input id="languages" placeholder="Español, ingles intermedio" maxLength={100} className={errors.languages ? "mt-1.5 borde-danger" : "mt-1.5"}
           value={conditions.languages} onChange={(event) => updateField("languages", event.target.value)} />
           {errors.languages && (<p className="mt-1 text-xs font-semibold text-danger">{errors.languages}</p>)}
        </div>
      </div>

      <div className="flex justify-between gap-3 px-6 pb-6">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="button" onClick={onContinue} className="bg-accent text-white hover:bg-danger">
          Continuar
        </Button>
      </div>
    </div>
  );
}
