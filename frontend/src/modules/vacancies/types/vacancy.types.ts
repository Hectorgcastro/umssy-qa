export interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export interface TechSkillsSelectorProps {
  skills: string[];
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  onRemoveSkill?: (skill: string) => void;
  onOpenAddModal: () => void;
}