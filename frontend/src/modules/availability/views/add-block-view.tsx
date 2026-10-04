"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheckIcon } from "lucide-react";
import { BlockForm } from "../components/block-form";
import { useCreateAvailabilityBlock } from "../hooks/use-create-availability-block";
import type { CreateAvailabilityBlockInput } from "../types/availability";

const MY_AVAILABILITY_PATH = "/mentor/availability";

export function AddBlockView() {
  const router = useRouter();
  const { createBlock, isSubmitting, error } = useCreateAvailabilityBlock();
  const [formKey, setFormKey] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (values: CreateAvailabilityBlockInput) => {
    setIsSaved(false);
    const block = await createBlock(values);
    if (block) {
      setIsSaved(true);
      setFormKey((key) => key + 1);
    }
  };

  const handleCancel = () => {
    router.push(MY_AVAILABILITY_PATH);
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-semibold text-muted-foreground">Mentorías / Mi disponibilidad</p>
        <h1 className="font-heading text-2xl font-bold">Agregar bloque</h1>
      </header>

      {isSaved && (
        <p role="status" className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm">
          <CircleCheckIcon aria-hidden="true" className="size-4 shrink-0" />
          <span className="font-semibold">Bloque guardado correctamente.</span>
        </p>
      )}

      <div className="w-full max-w-3xl">
        <BlockForm
          key={formKey}
          mode="create"
          isSubmitting={isSubmitting}
          submitError={error}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
