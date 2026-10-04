"use client";

import { ProfilePageLayout } from "../components/profile-page-layout";
import { SectionCard } from "../components/section-card";
import { SkillsSelector } from "../components/skills-selector";
import { TrajectorySteps } from "../components/trajectory-steps";
import { useSkills } from "../hooks/use-skills";

export function SkillsView() {
  const {
    catalogSkills,
    selectedSkills,
    isLoading,
    isSaving,
    feedback,
    addSkill,
    removeSkill,
    createCustomSkill,
    saveSkills,
  } = useSkills();

  return (
    <ProfilePageLayout
      activeTab="trajectory"
      title="Trayectoria"
      description="Selecciona tecnologías y herramientas que dominas o agrega las tuyas."
    >
      <TrajectorySteps activeStep="skills" />
      <SectionCard title="Habilidades técnicas">
        {isLoading ? (
          <p role="status" className="text-[13px] text-text-secondary">
            Cargando habilidades...
          </p>
        ) : (
          <SkillsSelector
            catalogSkills={catalogSkills}
            selectedSkills={selectedSkills}
            onAddSkill={addSkill}
            onRemoveSkill={removeSkill}
            onCreateCustomSkill={createCustomSkill}
            onSave={() => void saveSkills()}
            isSaving={isSaving}
            feedback={feedback}
          />
        )}
      </SectionCard>
    </ProfilePageLayout>
  );
}
