"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CircleCheckIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { addWeeks, getWeekRange } from "@/shared/utils/date-time";
import { cn } from "cn";
import { MY_AVAILABILITY_TEXT } from "../constants/my-availability.constants";
import { AvailabilityLoading } from "../components/availability-loading";
import { BlockForm } from "../components/block-form";
import { DeleteBlockDialog } from "../components/delete-block-dialog";
import { WeekGrid } from "../components/week-grid/week-grid";
import { useCreateAvailabilityBlock } from "../hooks/use-create-availability-block";
import { useMyBlocks } from "../hooks/use-my-blocks";
import type { AvailabilityBlock } from "../types/availability-block.types";
import type { CreateAvailabilityBlockInput } from "../types/create-availability-block-input.types";
import { formatWeekLabel } from "../utils/format-week-label";

export function MentorAvailabilityView() {
  const [weekStart, setWeekStart] = useState(() => getWeekRange(new Date()).startAt);
  const [blockToDelete, setBlockToDelete] = useState<AvailabilityBlock | null>(null);
  const { blocks, isLoading, error, refetch } = useMyBlocks(weekStart);
  const { createBlock, isSubmitting, error: createError } = useCreateAvailabilityBlock();
  const [formKey, setFormKey] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const weekRange = getWeekRange(weekStart);
  const currentWeekStart = getWeekRange(new Date()).startAt;

  const handleCreate = async (values: CreateAvailabilityBlockInput) => {
    setIsSaved(false);
    const block = await createBlock(values);
    if (block) {
      setIsSaved(true);
      setFormKey((key) => key + 1);
      const blockWeekStart = getWeekRange(block.startAt).startAt;
      if (blockWeekStart === weekStart) {
        refetch();
      } else {
        setWeekStart(blockWeekStart);
      }
    }
  };

  const handleCancelCreate = () => {
    setIsSaved(false);
    setFormKey((key) => key + 1);
  };

  return (
    <div className="space-y-4 p-6">
      <header>
        <h1 className="text-2xl font-bold">{MY_AVAILABILITY_TEXT.title}</h1>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <nav
            aria-label={MY_AVAILABILITY_TEXT.weekNavigation}
            className="flex flex-wrap items-center gap-2"
          >
            <Button
              variant="outline"
              size="icon"
              aria-label={MY_AVAILABILITY_TEXT.previousWeek}
              onClick={() => setWeekStart(addWeeks(weekStart, -1))}
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <p className="min-w-44 text-center text-sm font-medium" aria-live="polite">
              {formatWeekLabel(weekRange)}
            </p>
            <Button
              variant="outline"
              size="icon"
              aria-label={MY_AVAILABILITY_TEXT.nextWeek}
              onClick={() => setWeekStart(addWeeks(weekStart, 1))}
            >
              <ChevronRight aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              disabled={weekStart === currentWeekStart}
              onClick={() => setWeekStart(currentWeekStart)}
            >
              {MY_AVAILABILITY_TEXT.today}
            </Button>
          </nav>

          {isLoading ? (
            <AvailabilityLoading />
          ) : error ? (
            <p className="text-center text-destructive">{error}</p>
          ) : blocks.length === 0 ? (
            <section
              className={cn(
                "flex flex-col items-center gap-3 rounded-lg",
                "border border-dashed border-border p-8 text-center",
              )}
            >
              <p className="text-muted-foreground">{MY_AVAILABILITY_TEXT.emptyWeek}</p>
            </section>
          ) : (
            // TODO: abrir el panel de detalle del bloque (#164) en lugar del diálogo de eliminar
            <WeekGrid
              blocks={blocks}
              weekRange={weekRange}
              variant="owner"
              onEditBlock={setBlockToDelete}
            />
          )}
        </div>

        <div className="space-y-4">
          {isSaved && (
            <Alert role="status" className="rounded-xl px-4 py-3">
              <CircleCheckIcon aria-hidden="true" />
              <AlertTitle className="font-semibold">{MY_AVAILABILITY_TEXT.blockSaved}</AlertTitle>
            </Alert>
          )}
          <BlockForm
            key={formKey}
            mode="create"
            isSubmitting={isSubmitting}
            submitError={createError}
            onSubmit={handleCreate}
            onCancel={handleCancelCreate}
          />
        </div>
      </div>

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
