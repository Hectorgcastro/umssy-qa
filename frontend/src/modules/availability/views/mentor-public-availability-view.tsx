"use client";

import { useAvailability } from "../hooks/use-availability";

interface MentorPublicAvailabilityViewProps {
  mentorId: string;
}

export function MentorPublicAvailabilityView({ mentorId }: MentorPublicAvailabilityViewProps) {
  const { blocks, isLoading, error } = useAvailability({ mentorId });

  if (isLoading) {
    return <div className="p-6 text-center">Loading availability...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mentor Availability</h1>
      {blocks.length === 0 ? (
        <p className="text-gray-500">No availability blocks available.</p>
      ) : (
        <ul className="space-y-2">
          {blocks.map((block) => (
            <li key={block.id} className="p-4 border rounded bg-white">
              <p>Start: {new Date(block.startAt).toLocaleString()}</p>
              <p>End: {new Date(block.endAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
