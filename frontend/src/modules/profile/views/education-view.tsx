import { EducationForm } from "../components/education-form";
import { EducationListCard } from "../components/education-list-card";
import { ProfilePageLayout } from "../components/profile-page-layout";
import { SAMPLE_EDUCATIONS } from "../config/education-samples.config";

export function EducationView() {
  return (
    <ProfilePageLayout
      activeTab="trajectory"
      title="Formación académica"
      description="Muestra tus estudios, títulos y las fechas en que cursaste cada formación."
    >
      <div className="grid grid-cols-2 items-start gap-6">
        <EducationListCard educations={SAMPLE_EDUCATIONS} />
        <EducationForm />
      </div>
    </ProfilePageLayout>
  );
}
