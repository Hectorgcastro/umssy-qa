import { MentorProfileView } from "@/modules/mentorship/views/mentor-profile-view";

interface MentorProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MentorProfilePage({
  params,
}: MentorProfilePageProps) {
  const { id } = await params;

  return <MentorProfileView mentorId={id} />;
}
