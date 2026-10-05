"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { WeekGrid } from "../week-grid/week-grid";
import type { AvailabilityBlock } from "../../types/availability-block.types";
import type { WeekRange } from "@/shared/types/week-range.types";

interface BlockSelectionProps {
  blocks: AvailabilityBlock[];
  weekRange: WeekRange;
  fetchFreeBlocks: () => Promise<AvailabilityBlock[]>;
}

export function BlockSelection({
  blocks,
  weekRange,
  fetchFreeBlocks,
}: BlockSelectionProps) {
  const [currentBlocks, setCurrentBlocks] =
    useState<AvailabilityBlock[]>(blocks);

  const [selectedBlock, setSelectedBlock] =
    useState<AvailabilityBlock | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setCurrentBlocks(blocks);
    setSelectedBlock(null);
  }, [blocks, weekRange]);

  const freeBlocks = useMemo(
    () => currentBlocks.filter((block) => block.state === "free"),
    [currentBlocks],
  );

  const refreshBlocks = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const refreshedBlocks = await fetchFreeBlocks();

      const refreshedFreeBlocks = refreshedBlocks.filter(
        (block) => block.state === "free",
      );

      setCurrentBlocks(refreshedFreeBlocks);

      setSelectedBlock((current) => {
        if (!current) return null;

        const stillAvailable = refreshedFreeBlocks.some(
          (block) => block.id === current.id,
        );

        return stillAvailable ? current : null;
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchFreeBlocks]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Selecciona un horario disponible
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void refreshBlocks()}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      <WeekGrid
        blocks={freeBlocks}
        weekRange={weekRange}
        variant="selectable"
        onSelectBlock={setSelectedBlock}
      />

      {selectedBlock && (
        <div className="rounded-md border p-3 text-sm">
          Horario seleccionado:{" "}
          {new Date(selectedBlock.startAt).toLocaleString("es-BO")}
        </div>
      )}
    </div>
  );
}
