"use client";

import Link from "next/link";
import { useHome } from "../hooks/use-home";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SkillsDetectedList } from "../components/skills-detected-list";

export function HomeView() {
  const { backendMessage } = useHome();

  return (
    <div className="flex flex-1 items-center justify-center bg-surface-soft p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>PWA Egresados UMSS</CardTitle>
          <CardDescription>
            Respuesta del backend: <strong>{backendMessage}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          
          <SkillsDetectedList
          skills={["Python", "Django", "Scrum"]}
          processingTime={1.5}
          />



          <Button>Botón de ejemplo</Button>
          	<Button asChild>
    			<Link href="/vacantes">Vacantes</Link>
  		</Button>
        </CardContent>
      </Card>
    </div>
  );
}
