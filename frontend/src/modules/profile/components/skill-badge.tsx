import { X } from "lucide-react";
import { SKILLS_TEXTS } from "../config/skills-texts.config";
import type { SkillBadgeProps } from "../types/skill-badge-props.types";

export function SkillBadge({ skill, onRemove }: SkillBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface px-3 py-1.5 text-[13px] font-semibold text-ink">
      {skill.name}
      <button
        type="button"
        onClick={() => onRemove(skill.id)}
        aria-label={`${SKILLS_TEXTS.removeSkillLabelPrefix} ${skill.name}`}
        className="text-text-secondary hover:text-accent focus:outline-none"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    </span>
  );
}
