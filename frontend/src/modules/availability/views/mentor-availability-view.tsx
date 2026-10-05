"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { addWeeks, getWeekRange } from "@/shared/utils/date-time";
import { cn } from "cn";
import { MY_AVAILABILITY_PATH, NEW_BLOCK_PATH } from "../constants/availability.constants";
import { MY_AVAILABILITY_TEXT } from "../constants/my-availability.constants";
import { AvailabilityLoading } from "../components/availability-loading";
import { WeekGrid } from "../components/week-grid/week-grid";
import { useMyBlocks } from "../hooks/use-my-blocks";
import type { AvailabilityBlock } from "../types/availability-block.types";
import type { WeekStartProps } from "../types/week-start-props.types";
import { formatWeekLabel } from "../utils/format-week-label";

export function MentorAvailabilityView({ initialWeekStart }: WeekStartProps) {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState(
    () => initialWeekStart ?? getWeekRange(new Date()).startAt,
  );
  const { blocks, isLoading, error } = useMyBlocks(weekStart);
  const weekRange = getWeekRange(weekStart);
  const currentWeekStart = getWeekRange(new Date()).startAt;

  const handleEditBlock = (block: AvailabilityBlock) => {
    router.push(
      `${MY_AVAILABILITY_PATH}/${block.id}/edit?week=${encodeURIComponent(weekStart)}`,
    );
  };

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
  );
}
