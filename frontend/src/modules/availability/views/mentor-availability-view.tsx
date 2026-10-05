"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { addWeeks, getWeekRange } from "@/shared/utils/date-time";
import { cn } from "cn";
import { NEW_BLOCK_PATH } from "../constants/availability.constants";
import { MY_AVAILABILITY_TEXT } from "../constants/my-availability.constants";
import { AvailabilityLoading } from "../components/availability-loading";
import { EditBlockPanel } from "../components/edit-block-panel";
import { WeekGrid } from "../components/week-grid/week-grid";
import { useMyBlocks } from "../hooks/use-my-blocks";
import type { AvailabilityBlock } from "../types/availability-block.types";
import type { MentorAvailabilityViewProps } from "../types/mentor-availability-view-props.types";
import { formatWeekLabel } from "../utils/format-week-label";

export function MentorAvailabilityView({ initialWeekStart }: MentorAvailabilityViewProps) {
  const [weekStart, setWeekStart] = useState(
    () => initialWeekStart ?? getWeekRange(new Date()).startAt,
  );
  const [editBlockId, setEditBlockId] = useState<string | null>(null);
  const { blocks, isLoading, error, refetch } = useMyBlocks(weekStart);
  const weekRange = getWeekRange(weekStart);
  const currentWeekStart = getWeekRange(new Date()).startAt;

  const handleWeekChange = (nextWeekStart: string) => {
    setEditBlockId(null);
    setWeekStart(nextWeekStart);
  };

  const handleEditBlock = (block: AvailabilityBlock) => {
    setEditBlockId(block.id);
  };

  const handleClosePanel = () => {
    setEditBlockId(null);
    refetch();
  };

  const editBlock = editBlockId
    ? blocks.find((item) => item.id === editBlockId) ?? null
    : null;
  const isPanelOpen = Boolean(editBlockId) && !error;

  return (
    <div className="space-y-4 p-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{MY_AVAILABILITY_TEXT.title}</h1>
        <Link href={NEW_BLOCK_PATH} className={buttonVariants()}>
          <Plus aria-hidden="true" />
          {MY_AVAILABILITY_TEXT.newBlock}
        </Link>
      </header>

      <nav
        aria-label={MY_AVAILABILITY_TEXT.weekNavigation}
        className="flex flex-wrap items-center gap-2"
      >
        <Button
          variant="outline"
          size="icon"
          aria-label={MY_AVAILABILITY_TEXT.previousWeek}
          onClick={() => handleWeekChange(addWeeks(weekStart, -1))}
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
          onClick={() => handleWeekChange(addWeeks(weekStart, 1))}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          disabled={weekStart === currentWeekStart}
          onClick={() => handleWeekChange(currentWeekStart)}
        >
          {MY_AVAILABILITY_TEXT.today}
        </Button>
      </nav>

      <div
        className={cn(
          "grid gap-6",
          isPanelOpen && "xl:grid-cols-[minmax(0,1fr)_19rem]",
        )}
      >
        <div className="min-w-0">
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
              <Link href={NEW_BLOCK_PATH} className={buttonVariants({ variant: "outline" })}>
                <Plus aria-hidden="true" />
                {MY_AVAILABILITY_TEXT.newBlock}
              </Link>
            </section>
          ) : (
            <WeekGrid
              blocks={blocks}
              weekRange={weekRange}
              variant="owner"
              onEditBlock={handleEditBlock}
            />
          )}
        </div>

        {isPanelOpen ? (
          <div className="order-first animate-in fade-in slide-in-from-right duration-200 xl:order-none">
            {isLoading ? (
              <AvailabilityLoading />
            ) : (
              <EditBlockPanel block={editBlock} onClose={handleClosePanel} />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
