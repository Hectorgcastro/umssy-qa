import type { AvailabilityBlockListProps } from "../types/availability-block-list-props.types";

const DATE_LOCALE = "es-BO";

export function AvailabilityBlockList({ blocks, emptyMessage }: AvailabilityBlockListProps) {
  if (blocks.length === 0) {
    return <p className="text-gray-500">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2">
      {blocks.map((block) => (
        <li key={block.id} className="p-4 border rounded bg-white">
          <p>Inicio: {new Date(block.startAt).toLocaleString(DATE_LOCALE)}</p>
          <p>Fin: {new Date(block.endAt).toLocaleString(DATE_LOCALE)}</p>
        </li>
      ))}
    </ul>
  );
}
