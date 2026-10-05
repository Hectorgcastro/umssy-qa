import { EditBlockView } from "@/modules/availability";

export default async function EditAvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string | string[] }>;
}) {
  const { week } = await searchParams;
  return <EditBlockView initialWeekStart={typeof week === "string" ? week : undefined} />;
}
