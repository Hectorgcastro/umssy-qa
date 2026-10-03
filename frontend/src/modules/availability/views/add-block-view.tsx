"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">Mentorías</p>
        <h1 className="font-heading text-2xl font-bold">Mi disponibilidad</h1>
      </header>

      {isSaved && (
        <p role="status" className="rounded-lg border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-700">
          Bloque guardado correctamente
        </p>
      )}

      <BlockForm
        key={formKey}
        mode="create"
        isSubmitting={isSubmitting}
        submitError={error}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
