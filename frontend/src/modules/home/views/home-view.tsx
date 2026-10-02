"use client";

import { useHome } from "../hooks/use-home";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function HomeView() {
  const { backendMessage } = useHome();

  return (
    <div className="flex flex-1 items-center justify-center bg-surface-soft p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="font-heading text-2xl font-extrabold">PWA Egresados UMSS</h1>
          <CardDescription>
            Respuesta del servidor: <strong>{backendMessage}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Botón de ejemplo</Button>
        </CardContent>
      </Card>
    </div>
  );
}