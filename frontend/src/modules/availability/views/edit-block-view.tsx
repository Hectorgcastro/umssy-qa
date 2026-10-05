"use client";

import { useParams, useRouter } from "next/navigation";
import { AvailabilityLoading } from "../components/availability-loading";
import { BlockForm } from "../components/block-form";
import { BLOCK_LOAD_ERROR, MY_AVAILABILITY_PATH } from "../constants/availability.constants";
import { useAvailability } from "../hooks/use-availability";
import { useUpdateAvailabilityBlock } from "../hooks/use-update-availability-block";
import type { CreateAvailabilityBlockInput } from "../types/create-availability-block-input.types";

export function EditBlockView() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { blocks, isLoading, error } = useAvailability();
  const { updateBlock, isSubmitting, error: submitError } = useUpdateAvailabilityBlock();

  const block = blocks.find((item) => item.id === id);

  if (isLoading) {
    return <AvailabilityLoading />;
  }

  if (error) {
    return <p className="p-6 text-center text-destructive">{error}</p>;
  }

  if (!block) {
    return <p className="p-6 text-center text-destructive">{BLOCK_LOAD_ERROR}</p>;
  }

  const handleSubmit = async (values: CreateAvailabilityBlockInput) => {
    const updated = await updateBlock(block.id, values);
    if (updated) {
      router.push(MY_AVAILABILITY_PATH);
    }
  };

  const handleCancel = () => {
    router.push(MY_AVAILABILITY_PATH);
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-semibold text-muted-foreground">Mentorías / Mi disponibilidad</p>
        <h1 className="font-heading text-2xl font-bold">Editar bloque de disponibilidad</h1>
      </header>

      <div className="w-full max-w-3xl">
        <BlockForm
          mode="edit"
          initialValues={{ startAt: block.startAt, endAt: block.endAt }}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
