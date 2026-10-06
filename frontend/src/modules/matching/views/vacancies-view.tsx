"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVacancies } from "../hooks/use-vacancies";
import { MatchScoreBar } from "../components/match-score-bar";

export function VacanciesView() {
  const [page, setPage] = useState(1);
  const query = useVacancies(page);
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-8">
      <h1 className="text-2xl font-bold text-ink">
        Vacantes recomendadas para ti
      </h1>
      <p className="text-text-secondary">
        Oportunidades ordenadas según tu carrera, experiencia y habilidades.
      </p>
      {query.isPending ? <p role="status">Cargando oportunidades...</p> : null}
      {query.isError ? (
        <div role="alert">
          <p>
            No se pudieron cargar las oportunidades. Comprueba tu sesión y
            conexión.
          </p>
          <Button onClick={() => void query.refetch()}>Reintentar</Button>
        </div>
      ) : null}
      {query.data ? (
        <>
          {query.data.items.length === 0 ? (
            <p role="status">No hay oportunidades disponibles.</p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {query.data.items.map((vacancy) => (
              <Card key={vacancy.id}>
                <CardHeader>
                  <CardTitle className="break-words">{vacancy.title}</CardTitle>
                  <p>{vacancy.companyName}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MatchScoreBar value={vacancy.compatibility} />
                  <Link
                    href={`/vacantes/${vacancy.id}`}
                    className="font-semibold text-accent underline"
                  >
                    Ver oportunidad
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <nav
            aria-label="Paginación de oportunidades"
            className="flex flex-wrap items-center gap-4"
          >
            <Button
              variant="outline"
              disabled={page <= 1 || query.isFetching}
              onClick={() => setPage((current) => current - 1)}
            >
              Anterior
            </Button>
            <span>Página {page}</span>
            <Button
              variant="outline"
              disabled={
                page * query.data.limit >= query.data.total || query.isFetching
              }
              onClick={() => setPage((current) => current + 1)}
            >
              Siguiente
            </Button>
          </nav>
        </>
      ) : null}
    </main>
  );
}
