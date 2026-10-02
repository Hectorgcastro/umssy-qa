"use client";

import { useAvailability } from "../hooks/use-availability";

interface MentorPublicAvailabilityViewProps {
  mentorId: string;
}

export function MentorPublicAvailabilityView({ mentorId }: MentorPublicAvailabilityViewProps) {
  const { blocks, isLoading, error } = useAvailability({ mentorId });

  if (isLoading) {
    return <div className="p-6 text-center">Cargando disponibilidad...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Disponibilidad del Mentor</h1>
      {blocks.length === 0 ? (
        <p className="text-gray-500">No hay bloques de disponibilidad disponibles.</p>
      ) : (
        <ul className="space-y-2">
          {blocks.map((block) => (
            <li key={block.id} className="p-4 border rounded bg-white">
              <p>Inicio: {new Date(block.startAt).toLocaleString()}</p>
              <p>Fin: {new Date(block.endAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
