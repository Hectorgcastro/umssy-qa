"use client";

import { ProfilePageLayout } from "../components/profile-page-layout";
import { SectionCard } from "../components/section-card";
import { SkillsSelector } from "../components/skills-selector";
import { TrajectorySteps } from "../components/trajectory-steps";
import { SKILLS_TEXTS } from "../config/skills-texts.config";
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
      title={SKILLS_TEXTS.pageTitle}
      description={SKILLS_TEXTS.pageDescription}
    >
      <TrajectorySteps activeStep="skills" />
      <SectionCard title={SKILLS_TEXTS.sectionTitle}>
        {isLoading ? (
          <p role="status" className="text-[13px] text-text-secondary">
            {SKILLS_TEXTS.loading}
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
