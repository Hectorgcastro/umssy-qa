"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { LoaderCircle, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { SkillsSelectorProps } from "../types/skills-selector-props.types";
import { getFieldErrorProps } from "../utils/get-field-error-props";
import { validateCustomSkill } from "../utils/validate-custom-skill";
import { FeedbackMessage } from "./feedback-message";
import { FormField } from "./form-field";
import { SkillBadge } from "./skill-badge";

export function SkillsSelector({
  catalogSkills = [],
  selectedSkills = [],
  onAddSkill,
  onRemoveSkill,
  onCreateCustomSkill,
  onSave,
  isSaving = false,
  feedback = null,
}: SkillsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customSkillName, setCustomSkillName] = useState("");
  const [customSkillError, setCustomSkillError] = useState("");

  const selectedIds = useMemo(
    () => new Set(selectedSkills.map((skill) => skill.id)),
    [selectedSkills],
  );

  const filteredCatalog = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    if (!normalizedTerm) return catalogSkills;
    return catalogSkills.filter((skill) => skill.name.toLowerCase().includes(normalizedTerm));
  }, [catalogSkills, searchTerm]);

  const handleCreateCustomSkill = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validateCustomSkill(customSkillName, [...catalogSkills, ...selectedSkills]);
    if (error) {
      setCustomSkillError(error);
      return;
    }

    onCreateCustomSkill(customSkillName.trim());
    setCustomSkillName("");
    setCustomSkillError("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-[15px] font-semibold text-ink">Mis habilidades</h3>
        {selectedSkills.length === 0 ? (
          <p className="text-[13px] text-text-secondary">No tienes habilidades seleccionadas aún.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} onRemove={onRemoveSkill} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <FormField id="skills-search" label="Buscar en el catálogo">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-text-secondary"
            />
            <Input
              id="skills-search"
              type="text"
              placeholder="Buscar en el catálogo"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={cn("w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0", "pl-11")}
            />
          </div>
        </FormField>

        <ul className="max-h-64 divide-y divide-border overflow-y-auto">
          {filteredCatalog.length === 0 ? (
            <li className="py-3 text-[13px] text-text-secondary">No se encontraron coincidencias en el catálogo.</li>
          ) : (
            filteredCatalog.map((skill) => {
              const isSelected = selectedIds.has(skill.id);

              return (
                <li key={skill.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-ink">{skill.name}</span>
                    {skill.category ? (
                      <span className="text-[13px] text-text-secondary">{skill.category}</span>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isSelected}
                    onClick={() => onAddSkill(skill)}
                    className="gap-1 text-[13px] font-semibold text-ink hover:bg-transparent hover:text-accent disabled:text-text-secondary"
                  >
                    <Plus aria-hidden="true" className="size-3.5" />
                    {isSelected ? "Agregada" : "Añadir"}
                  </Button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <form noValidate onSubmit={handleCreateCustomSkill}>
        <FormField
          id="custom-skill"
          label="Agregar habilidad propia"
          error={customSkillError}
        >
          <div className="flex gap-3">
            <Input
              id="custom-skill"
              type="text"
              placeholder="Ej. Docker"
              value={customSkillName}
              onChange={(event) => {
                setCustomSkillName(event.target.value);
                setCustomSkillError("");
              }}
              className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
              {...getFieldErrorProps("custom-skill", customSkillError)}
            />
            <Button type="submit" variant="outline" className="h-12 border-border-strong bg-surface px-6 text-[14px] font-semibold text-ink hover:bg-surface-soft">
              Agregar
            </Button>
          </div>
        </FormField>
      </form>

      <div className="flex flex-col gap-4">
        {feedback ? <FeedbackMessage feedback={feedback} /> : null}
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className={cn("h-12 bg-accent px-6 text-[14px] font-semibold text-white hover:bg-danger", "w-full")}
        >
          {isSaving ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {isSaving ? "Guardando..." : "Guardar habilidades"}
        </Button>
      </div>
    </div>
  );
}
