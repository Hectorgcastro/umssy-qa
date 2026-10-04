"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toBoliviaTime } from "@/shared/utils/date-time";
import { cn } from "cn";
import {
  DAY_LABELS,
  HOUR_HEIGHT_PX,
  STATE_BUTTON_CLASSES,
  STATE_BUTTON_VARIANT,
  STATE_LABELS_ES,
  WEEK_GRID_END_HOUR,
  WEEK_GRID_START_HOUR,
} from "../../constants/week-grid.constants";
import type { AvailabilityBlock } from "../../types/availability-block.types";
import type { WeekGridProps } from "../../types/week-grid-props.types";
import { getBlockVerticalPosition, getWeekDayIndex } from "./week-grid.utils";

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function WeekGrid({
  blocks,
  weekRange,
  variant,
  startHour = WEEK_GRID_START_HOUR,
  endHour = WEEK_GRID_END_HOUR,
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
    if (variant === "selectable" && block.state === "free") {
      onSelectBlock?.(block);
    }
    if (variant === "owner" && block.state === "free") {
      onEditBlock?.(block);
    }
  }

  return (
    <TooltipProvider>
      <section aria-label="Disponibilidad semanal">
        <div className="grid grid-cols-[2.5rem_repeat(7,1fr)] rounded-lg border border-border overflow-hidden">
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

                    const clickable =
                      (variant === "selectable" || variant === "owner") &&
                      block.state === "free";

                    const stateLabel = STATE_LABELS_ES[block.state];
                    const timeRange = `${toBoliviaTime(block.startAt).time} a ${toBoliviaTime(block.endAt).time}`;

                    return (
                      <li
                        key={block.id}
                        className="absolute left-0.5 right-0.5"
                        style={{ top: topPx, height: heightPx }}
                      >
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant={STATE_BUTTON_VARIANT[block.state]}
                                disabled={!clickable}
                                onClick={() => handleBlockClick(block)}
                                className={cn(
                                  "h-full w-full rounded px-1 text-[9px]",
                                  STATE_BUTTON_CLASSES[block.state]
                                )}
                                aria-label={`${stateLabel}, ${timeRange}`}
                              >
                                {block.state === "free"
                                  ? "Libre"
                                  : toBoliviaTime(block.startAt).time}
                              </Button>
                            }
                          />
                          <TooltipContent>
                            {capitalize(stateLabel)}, {timeRange}
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <ul aria-label="Leyenda" className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
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
        </ul>
      </section>
    </TooltipProvider>
  );
}