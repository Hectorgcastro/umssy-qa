"use client";

import { useState } from "react";
import { useAvailability } from "../hooks/use-availability";
import { AvailabilityBlockList } from "../components/availability-block-list";
import { AvailabilityLoading } from "../components/availability-loading";
import { DeleteBlockDialog } from "../components/delete-block-dialog";
import type { AvailabilityBlock } from "../types/availability-block.types";

export function MentorAvailabilityView() {
  const { blocks, isLoading, error, refetch } = useAvailability();
  const [blockToDelete, setBlockToDelete] = useState<AvailabilityBlock | null>(null);

  if (isLoading) {
    return <AvailabilityLoading />;
  }

  if (error) {
    return <p className="p-6 text-center text-destructive">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Disponibilidad</h1>
      <AvailabilityBlockList
        blocks={blocks}
        emptyMessage="No hay bloques de disponibilidad aún."
        onDelete={setBlockToDelete}
      />
      <DeleteBlockDialog
        block={blockToDelete}
        open={blockToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setBlockToDelete(null);
        }}
        onDeleted={refetch}
      />
    </div>
  );
}
