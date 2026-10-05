"use client";

import { Button } from "@/components/ui/button";
import { toBoliviaTime } from "@/shared/utils/date-time";
import { cn } from "cn";
import {
  DAY_LABELS,
  HOUR_HEIGHT_PX,
  SELECTED_BLOCK_CLASSES,
  SELECTED_LEGEND_LABEL,
  STATE_BUTTON_CLASSES,
  STATE_BUTTON_VARIANT,
  STATE_LABELS_ES,
  WEEK_GRID_END_HOUR,
  WEEK_GRID_START_HOUR,
} from "../../constants/week-grid.constants";
import type { AvailabilityBlock } from "../../types/availability-block.types";
import type { WeekGridProps } from "../../types/week-grid-props.types";
import {
  getBlockVerticalPosition,
  getWeekDayDates,
  getWeekDayIndex,
  isBlockClickable,
} from "../../utils/week-grid.utils";
import { WeekDayList } from "./week-day-list";

export function WeekGrid({
  blocks,
  weekRange,
  variant,
  startHour = WEEK_GRID_START_HOUR,
  endHour = WEEK_GRID_END_HOUR,
  selectedBlockId,
  onSelectBlock,
  onEditBlock,
}: WeekGridProps) {
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const gridHeightPx = hours.length * HOUR_HEIGHT_PX;

  const blocksByDay: AvailabilityBlock[][] = Array.from({ length: 7 }, () => []);
  for (const block of blocks) {
    const dayIndex = getWeekDayIndex(block.startAt, weekRange);
    if (dayIndex !== null) blocksByDay[dayIndex].push(block);
  }

  function handleBlockClick(block: AvailabilityBlock) {
    if (!isBlockClickable(variant, block.state)) return;
    if (variant === "selectable") onSelectBlock?.(block);
    if (variant === "owner") onEditBlock?.(block);
  }

  return (
    <section aria-label="Disponibilidad semanal">
      <div className="hidden md:grid grid-cols-[2.5rem_repeat(7,1fr)] rounded-lg border border-border overflow-hidden">
        <div aria-hidden="true">
          <div className="py-1 text-[10px]">&nbsp;</div>
          <ol className="relative" style={{ height: gridHeightPx }}>
            {hours.map((h) => (
              <li
                key={h}
                className="absolute right-1 text-[9px] text-muted-foreground"
                style={{ top: (h - startHour) * HOUR_HEIGHT_PX - 5 }}
              >
                <time dateTime={`${String(h).padStart(2, "0")}:00`}>
                  {String(h).padStart(2, "0")}:00
                </time>
              </li>
            ))}
          </ol>
        </div>

        {blocksByDay.map((dayBlocks, dayIndex) => (
          <section key={dayIndex} className="border-l border-border">
            <h3 className="text-center text-[10px] font-normal text-muted-foreground py-1">
              {DAY_LABELS[dayIndex]}
            </h3>

            <div className="relative" style={{ height: gridHeightPx }}>
              {hours.map((h) => (
                <div
                  key={h}
                  aria-hidden="true"
                  className="absolute w-full border-t border-border"
                  style={{ top: (h - startHour) * HOUR_HEIGHT_PX }}
                />
              ))}

              <ul>
                {dayBlocks.map((block) => {
                  const { topPx, heightPx } = getBlockVerticalPosition(
                    block.startAt,
                    block.endAt,
                    startHour,
                    endHour
                  );
                  if (heightPx <= 0) return null;

                  const isSelected = block.id === selectedBlockId;
                  const stateLabel = STATE_LABELS_ES[block.state];
                  const timeRange = `${toBoliviaTime(block.startAt).time} a ${toBoliviaTime(block.endAt).time}`;

                  return (
                    <li
                      key={block.id}
                      className="absolute left-0.5 right-0.5"
                      style={{ top: topPx, height: heightPx }}
                    >
                      <Button
                        type="button"
                        variant={STATE_BUTTON_VARIANT[block.state]}
                        disabled={!isBlockClickable(variant, block.state)}
                        onClick={() => handleBlockClick(block)}
                        className={cn(
                          "h-full w-full rounded px-1 text-[9px]",
                          STATE_BUTTON_CLASSES[block.state],
                          isSelected && SELECTED_BLOCK_CLASSES
                        )}
                        aria-pressed={isSelected || undefined}
                        aria-label={`${stateLabel}, ${timeRange}`}
                      >
                        {block.state === "free" ? "Libre" : toBoliviaTime(block.startAt).time}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <WeekDayList
        blocksByDay={blocksByDay}
        dayDates={getWeekDayDates(weekRange)}
        variant={variant}
        selectedBlockId={selectedBlockId}
        onBlockClick={handleBlockClick}
      />

      <ul
        aria-label="Leyenda"
        className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-muted-foreground"
      >
        <li className="flex items-center gap-1">
          <span aria-hidden="true" className="inline-block w-3 h-3 rounded-sm border border-border" />
          Libre
        </li>
        <li className="flex items-center gap-1">
          <span aria-hidden="true" className="inline-block w-3 h-3 rounded-sm border border-dashed border-muted-foreground" />
          Solicitud pendiente
        </li>
        <li className="flex items-center gap-1">
          <span aria-hidden="true" className="inline-block w-3 h-3 rounded-sm bg-ink" />
          Cita confirmada
        </li>
        {variant === "selectable" && (
          <li className="flex items-center gap-1">
            <span
              aria-hidden="true"
              className={cn("inline-block w-3 h-3 rounded-sm", SELECTED_BLOCK_CLASSES)}
            />
            {SELECTED_LEGEND_LABEL}
          </li>
        )}
      </ul>
    </section>
  );
}