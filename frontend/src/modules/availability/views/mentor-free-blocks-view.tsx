"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addWeeks, getWeekRange, toBoliviaTime } from "@/shared/utils/date-time";
import { AvailabilityLoading } from "../components/availability-loading";
import { BlockSelection } from "../components/block-selection/block-selection";
import { MENTOR_FREE_BLOCKS_TEXT } from "../constants/mentor-free-blocks.constants";
import { useMentorFreeBlocks } from "../hooks/use-mentor-free-blocks";
import { availabilityApi } from "../services/availability.api";
import type { MentorFreeBlocksViewProps } from "../types/mentor-free-blocks-view-props.types";

export function MentorFreeBlocksView({ mentorId }: MentorFreeBlocksViewProps) {
  const [referenceDate, setReferenceDate] = useState(() => new Date().toISOString());
  const weekRange = getWeekRange(referenceDate);
  const { blocks, isLoading, error } = useMentorFreeBlocks(mentorId, weekRange);

  const goToPreviousWeek = () => setReferenceDate((current) => addWeeks(current, -1));
  const goToNextWeek = () => setReferenceDate((current) => addWeeks(current, 1));

  const start = toBoliviaTime(weekRange.startAt);
  const end = toBoliviaTime(weekRange.endAt);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{MENTOR_FREE_BLOCKS_TEXT.heading}</h1>

      <div className="flex items-center justify-between mb-4">
        <Button type="button" variant="outline" size="sm" onClick={goToPreviousWeek}>
          {MENTOR_FREE_BLOCKS_TEXT.previousWeek}
        </Button>
        <span className="text-sm font-medium">
          {start.day}/{start.month} - {end.day}/{end.month}
        </span>
        <Button type="button" variant="outline" size="sm" onClick={goToNextWeek}>
          {MENTOR_FREE_BLOCKS_TEXT.nextWeek}
        </Button>
      </div>

      {isLoading ? (
        <AvailabilityLoading />
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : blocks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-muted-foreground">{MENTOR_FREE_BLOCKS_TEXT.empty}</p>
          <Button type="button" onClick={goToNextWeek}>
            {MENTOR_FREE_BLOCKS_TEXT.nextWeekFromEmpty}
          </Button>
        </div>
      ) : (
        <BlockSelection
          blocks={blocks}
          weekRange={weekRange}
          fetchFreeBlocks={() => availabilityApi.getMentorFreeBlocks(mentorId, weekRange)}
        />
      )}
    </div>
  );
}
