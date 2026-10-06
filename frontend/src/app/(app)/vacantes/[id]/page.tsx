import { VacancyDetailView } from "@/modules/matching/views/vacancy-detail-view";

export default async function VacancyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VacancyDetailView id={id} />;
}
