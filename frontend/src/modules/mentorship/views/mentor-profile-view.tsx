import { MentorProfileHeader } from "../components/mentor-profile-header";
import { MentorAbout } from "../components/mentor-about";
import { MentorCareer } from "../components/mentor-career";
import { MentorGuidanceTypes } from "../components/mentor-guidance-types";
import { MentorTechnicalAreas } from "../components/mentor-technical-areas";
import { mentorsMock } from "../services/mentor-profile.mock";
import { MentorProfileNavigation } from "../components/mentor-profile-navigation";

interface MentorProfileViewProps {
  mentorId: string;
}

export function MentorProfileView({ mentorId }: MentorProfileViewProps) {
  const mentor = mentorsMock.find((item) => item.id === Number(mentorId));

  if (!mentor) {
    return (
      <main className="min-h-screen bg-surface-soft p-8">
        <h1 className="text-2xl font-bold text-ink">
          Mentor no encontrado
        </h1>

        <p className="mt-2 text-text-secondary">
          No se pudo encontrar el perfil solicitado.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-soft p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <MentorProfileNavigation mentorName={mentor.name} />
        <MentorProfileHeader mentor={mentor} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <MentorAbout description={mentor.description} />

            <MentorGuidanceTypes
              key={mentor.id}
              guidanceTypes={mentor.guidanceTypes}
            />
          </div>

          <div className="flex flex-col gap-8 lg:col-span-4">
            <MentorCareer mentor={mentor} />

            <MentorTechnicalAreas areas={mentor.technicalAreas} />
          </div>
        </div>
      </div>
    </main>
  );
}
