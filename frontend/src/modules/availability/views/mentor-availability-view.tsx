"use client";

import { useAvailability } from "../hooks/use-availability";
import { AvailabilityBlockList } from "../components/availability-block-list";
import { AvailabilityLoading } from "../components/availability-loading";

export function MentorAvailabilityView() {
  const { blocks, isLoading, error } = useAvailability();

  if (isLoading) {
    return <AvailabilityLoading />;
  }

  if (error) {
    return <p className="p-6 text-center text-destructive">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Disponibilidad</h1>
      <AvailabilityBlockList blocks={blocks} emptyMessage="No hay bloques de disponibilidad aún." />
    </div>
  );
}
