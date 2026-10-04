"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { LoaderCircle, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  INPUT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from "../config/form-styles.config";
import { SKILLS_TEXTS } from "../config/skills-texts.config";
import type { SkillsSelectorProps } from "../types/skills-selector-props.types";
import { getFieldErrorProps } from "../utils/get-field-error-props";
import { validateCustomSkill } from "../utils/validate-custom-skill";
import { FeedbackMessage } from "./feedback-message";
import { FormField } from "./form-field";
import { SkillBadge } from "./skill-badge";

export function SkillsSelector({
  catalogSkills,
  selectedSkills,
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
        <h3 className="mb-3 text-[15px] font-semibold text-ink">{SKILLS_TEXTS.mySkillsTitle}</h3>
        {selectedSkills.length === 0 ? (
          <p className="text-[13px] text-text-secondary">{SKILLS_TEXTS.emptySelection}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} onRemove={onRemoveSkill} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <FormField id="skills-search" label={SKILLS_TEXTS.searchLabel}>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-text-secondary"
            />
            <input
              id="skills-search"
              type="text"
              placeholder={SKILLS_TEXTS.searchPlaceholder}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={cn(INPUT_CLASS, "pl-11")}
            />
          </div>
        </FormField>

        <ul className="max-h-64 divide-y divide-border overflow-y-auto">
          {filteredCatalog.length === 0 ? (
            <li className="py-3 text-[13px] text-text-secondary">{SKILLS_TEXTS.noMatches}</li>
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
                  <button
                    type="button"
                    disabled={isSelected}
                    onClick={() => onAddSkill(skill)}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink hover:text-accent disabled:text-text-secondary"
                  >
                    <Plus aria-hidden="true" className="size-3.5" />
                    {isSelected ? SKILLS_TEXTS.addedSkill : SKILLS_TEXTS.addSkill}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <form noValidate onSubmit={handleCreateCustomSkill}>
        <FormField
          id="custom-skill"
          label={SKILLS_TEXTS.customSkillLabel}
          error={customSkillError}
        >
          <div className="flex gap-3">
            <input
              id="custom-skill"
              type="text"
              placeholder={SKILLS_TEXTS.customSkillPlaceholder}
              value={customSkillName}
              onChange={(event) => {
                setCustomSkillName(event.target.value);
                setCustomSkillError("");
              }}
              className={INPUT_CLASS}
              {...getFieldErrorProps("custom-skill", customSkillError)}
            />
            <Button type="submit" variant="outline" className={SECONDARY_BUTTON_CLASS}>
              {SKILLS_TEXTS.createCustomSkill}
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
          className={cn(PRIMARY_BUTTON_CLASS, "w-full")}
        >
          {isSaving ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {isSaving ? SKILLS_TEXTS.savingSkills : SKILLS_TEXTS.saveSkills}
        </Button>
      </div>
    </div>
  );
}
