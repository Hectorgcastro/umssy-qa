import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DATE_LOCALE, EDIT_BLOCK_LABEL } from "../constants/availability.constants";
import { DELETE_BLOCK_TEXT } from "../constants/delete-block.constants";
import type { AvailabilityBlockListProps } from "../types/availability-block-list-props.types";

export function AvailabilityBlockList({ blocks, emptyMessage, onDelete, onEdit }: AvailabilityBlockListProps) {
  if (blocks.length === 0) {
    return <p className="text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2">
      {blocks.map((block) => (
        <li key={block.id}>
          <Card size="sm">
            <CardContent>
              <p>Inicio: {new Date(block.startAt).toLocaleString(DATE_LOCALE)}</p>
              <p>Fin: {new Date(block.endAt).toLocaleString(DATE_LOCALE)}</p>
              {onEdit && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 border-border-strong bg-surface text-ink hover:bg-surface-soft"
                  onClick={() => onEdit(block)}
                >
                  {EDIT_BLOCK_LABEL}
                </Button>
              )}
              {onDelete && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 border-border-strong bg-surface text-ink hover:bg-surface-soft"
                  onClick={() => onDelete(block)}
                >
                  {DELETE_BLOCK_TEXT.confirm}
                </Button>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
