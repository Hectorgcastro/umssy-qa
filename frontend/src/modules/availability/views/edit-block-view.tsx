"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getWeekRange } from "@/shared/utils/date-time";
import { AvailabilityLoading } from "../components/availability-loading";
import { BlockForm } from "../components/block-form";
import { DeleteBlockDialog } from "../components/delete-block-dialog";
import { BLOCK_LOAD_ERROR, MY_AVAILABILITY_PATH } from "../constants/availability.constants";
import { DELETE_BLOCK_TEXT } from "../constants/delete-block.constants";
import { useMyBlocks } from "../hooks/use-my-blocks";
import { useUpdateAvailabilityBlock } from "../hooks/use-update-availability-block";
import type { CreateAvailabilityBlockInput } from "../types/create-availability-block-input.types";
import type { WeekStartProps } from "../types/week-start-props.types";

export function EditBlockView({ initialWeekStart }: WeekStartProps) {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const weekStart = initialWeekStart ?? getWeekRange(new Date()).startAt;
  const { blocks, isLoading, error } = useMyBlocks(weekStart);
  const { updateBlock, isSubmitting, error: submitError } = useUpdateAvailabilityBlock();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const backPath = `${MY_AVAILABILITY_PATH}?week=${encodeURIComponent(weekStart)}`;

  const handleSubmit = async (values: CreateAvailabilityBlockInput) => {
    const updated = await updateBlock(block.id, values);
    if (updated) {
      router.push(backPath);
    }
  };

  const handleCancel = () => {
    router.push(backPath);
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

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="destructive"
            size="lg"
            onClick={() => setIsDeleteOpen(true)}
          >
            {DELETE_BLOCK_TEXT.action}
          </Button>
        </div>
      </div>

      <DeleteBlockDialog
        block={block}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDeleted={() => router.push(backPath)}
      />
    </div>
  );
}
