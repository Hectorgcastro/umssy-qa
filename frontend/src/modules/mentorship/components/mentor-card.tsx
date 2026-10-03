import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { MentorDirectoryItem } from "../types/mentor-directory.types";

interface MentorCardProps {
  mentor: MentorDirectoryItem;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const hasTechnicalAreas = mentor.technicalAreas.length > 0;

  return (
    <Card
      className="h-full border-border bg-surface shadow-sm"
      aria-labelledby={`mentor-${mentor.id}`}
    >
      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id={`mentor-${mentor.id}`}
              className="break-words text-lg font-semibold text-ink"
            >
              {mentor.fullName}
            </h2>

            <p className="mt-1 break-words text-sm text-text-secondary">
              {mentor.jobTitle ?? "Cargo no registrado"}
            </p>
          </div>

          <span
            className={[
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
              mentor.isAvailable
                ? "bg-interaction text-accent"
                : "bg-surface-soft text-text-secondary",
            ].join(" ")}
          >
            {mentor.isAvailable ? "Disponible" : "No disponible"}
          </span>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">
            Áreas técnicas
          </p>

          {hasTechnicalAreas ? (
            <ul className="flex flex-wrap gap-2">
              {mentor.technicalAreas.map((area) => (
                <li
                  key={area}
                  className="max-w-full break-words rounded-md border border-border bg-surface-soft px-2.5 py-1 text-xs text-ink-soft"
                >
                  {area}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-secondary">
              Sin áreas registradas
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto bg-surface">
        <Link
          href={`/mentors/${mentor.id}`}
          className={buttonVariants({
            variant: "outline",
            className: "w-full border-border-strong text-ink",
          })}
          aria-label={`Ver perfil de ${mentor.fullName}`}
        >
          Ver perfil
        </Link>
      </CardFooter>
    </Card>
  );
}