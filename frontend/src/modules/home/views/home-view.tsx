"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SkillsDetectedList } from "../components/skills-detected-list";

export function HomeView() {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 p-6 min-h-screen">
      <Card className="w-full max-w-2xl p-6 shadow-sm border-slate-200">
        <CardContent className="flex flex-col gap-6">
          {/* Aquí está tu componente de la Tarea 1.7 */}
          <SkillsDetectedList
            skills={["Python", "Django", "Scrum"]}
            processingTime={1.5}
          />
        </CardContent>
      </Card>
    </div>
  );
}