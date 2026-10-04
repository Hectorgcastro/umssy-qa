import Image from "next/image";
import { GraduationCap, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { MentorProfile } from "../../types/mentor-profile.types";

type MentorProfileHeaderProps = {
  mentor: MentorProfile;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function MentorProfileHeader({ mentor }: MentorProfileHeaderProps) {
  return (
    <Card className="gap-0 overflow-visible rounded-xl border border-umssy-border bg-white py-0 text-base ring-0">
      <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0">
            {mentor.profileImage ? (
              <Image
                src={mentor.profileImage}
                alt={`Foto de ${mentor.name}`}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-umssy-border text-2xl font-bold text-umssy-ink">
                {getInitials(mentor.name)}
              </div>
            )}

            <span
              className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white ${
                mentor.isAvailable ? "bg-umssy-red" : "bg-umssy-secondary"
              }`}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="break-words text-3xl font-extrabold text-umssy-ink">
                {mentor.name}
              </h1>

              <span className="inline-flex items-center gap-2 rounded-full border border-umssy-border bg-umssy-background px-3 py-1 text-sm text-umssy-secondary">
                <span
                  className={`h-2 w-2 rounded-full ${
                    mentor.isAvailable ? "bg-umssy-red" : "bg-umssy-secondary"
                  }`}
                />

                {mentor.isAvailable
                  ? "Disponible para mentoría"
                  : "No disponible"}
              </span>
            </div>

            <p className="mt-1 break-words text-lg font-semibold text-umssy-secondary">
              {mentor.specialty}
            </p>

            {mentor.professionalInterests.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase text-umssy-secondary">
                  Intereses profesionales
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {mentor.professionalInterests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-lg border border-umssy-border bg-umssy-background px-3 py-1 text-sm text-umssy-secondary"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 flex items-start gap-2 text-sm text-umssy-secondary">
              <GraduationCap
                size={18}
                className="mt-0.5 shrink-0 text-umssy-gold"
              />

              <p className="break-words">
                Egresado UMSS · {mentor.program} ({mentor.faculty})
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          disabled={!mentor.isAvailable}
          className={`h-auto w-full shrink-0 gap-2 rounded-lg border-0 px-6 py-3 text-base font-semibold transition active:translate-y-0 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-100 sm:w-auto ${
            mentor.isAvailable
              ? "bg-[#E30613] text-white hover:brightness-90"
              : "cursor-not-allowed bg-gray-200 text-gray-500"
          }`}
        >
          <UserPlus className="size-5" />
          Solicitar mentoría
        </Button>
      </CardContent>
    </Card>
  );
}
