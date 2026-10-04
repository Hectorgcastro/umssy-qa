import { BriefcaseBusiness } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { MentorProfile } from "../../types/mentor-profile.types";

interface MentorCareerProps {
  mentor: MentorProfile;
}

export function MentorCareer({ mentor }: MentorCareerProps) {
  return (
    <Card className="gap-0 overflow-visible rounded-xl border border-border bg-white py-0 text-base shadow-sm ring-0">
      <CardHeader className="px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-soft text-ink">
            <BriefcaseBusiness size={20} />
          </div>

          <CardTitle
            role="heading"
            aria-level={2}
            className="text-xl font-bold text-ink"
          >
            Trayectoria actual
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 px-6 pb-6 pt-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Cargo actual
          </p>

          <p className="mt-1 break-words font-semibold text-ink">{mentor.position || "Cargo no registrado"}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Empresa
          </p>

          <p className="mt-1 text-ink">{mentor.company}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Experiencia
          </p>

          <p className="mt-1 text-ink">
            +{mentor.yearsExperience} años en la industria
          </p>
        </div>

        <div>
          <Separator className="mb-4" />

          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Facultad de egreso
          </p>

          <p className="mt-1 text-ink">{mentor.faculty}</p>
        </div>
      </CardContent>
    </Card>
  );
}
