"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useVacancy } from "../hooks/use-vacancies";
import { MatchScoreBar } from "../components/match-score-bar";
import { RequirementsPanel } from "../components/requirements-panel";

export function VacancyDetailView({ id }: { id: string }) {
  const query = useVacancy(id);
  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-8">
      <Link href="/vacantes" className="font-medium text-accent underline">
        Volver
      </Link>
      {query.isPending ? <p role="status">Cargando oportunidad...</p> : null}
      {query.isError ? (
        <div role="alert">
          <p>La oportunidad no está disponible o no se pudo cargar.</p>
          <Button onClick={() => void query.refetch()}>Reintentar</Button>
        </div>
      ) : null}
      {query.data ? (
        <>
          <header>
            <h1 className="break-words text-2xl font-bold">
              {query.data.title}
            </h1>
            <p>{query.data.companyName}</p>
          </header>
          <MatchScoreBar value={query.data.compatibility} />
          <p className="whitespace-pre-wrap break-words">
            {query.data.description}
          </p>
          <RequirementsPanel gap={query.data.gap} />
        </>
      ) : null}
    </main>
  );
}
