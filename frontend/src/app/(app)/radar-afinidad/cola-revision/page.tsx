"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";

type EstadoPerfil = "Completado" | "Procesando" | "Pendiente";
type Filtro = "Todos" | EstadoPerfil;

type Perfil = {
  id: number;
  nombre: string;
  cargoObjetivo: string;
  fechaEnvio: string;
  afinidadGlobal: number;
  estado: EstadoPerfil;
};

const perfiles: Perfil[] = [
  {
    id: 1,
    nombre: "Ana Martínez",
    cargoObjetivo: "Full Stack Developer",
    fechaEnvio: "05/10/2026 18:20",
    afinidadGlobal: 8.5,
    estado: "Completado",
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    cargoObjetivo: "DevOps Engineer",
    fechaEnvio: "05/10/2026 17:45",
    afinidadGlobal: 7.3,
    estado: "Procesando",
  },
  {
    id: 3,
    nombre: "María López",
    cargoObjetivo: "Data Analyst",
    fechaEnvio: "05/10/2026 16:30",
    afinidadGlobal: 6.8,
    estado: "Pendiente",
  },
  {
    id: 4,
    nombre: "Diego Fernández",
    cargoObjetivo: "QA Engineer",
    fechaEnvio: "05/10/2026 15:10",
    afinidadGlobal: 6.2,
    estado: "Pendiente",
  },
];

const filtros: Filtro[] = [
  "Todos",
  "Completado",
  "Procesando",
  "Pendiente",
];

function obtenerIniciales(nombre: string) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join("")
    .toUpperCase();
}

function obtenerClasesEstado(estado: EstadoPerfil) {
  switch (estado) {
    case "Completado":
      return "border-ink/15 bg-ink text-surface";

    case "Procesando":
      return "border-gold/30 bg-gold/15 text-ink";

    case "Pendiente":
      return "border-accent/20 bg-interaction text-accent";
  }
}

export default function ColaRevisionPage() {
  const [filtroActivo, setFiltroActivo] = useState<Filtro>("Todos");

  const perfilesFiltrados =
    filtroActivo === "Todos"
      ? perfiles
      : perfiles.filter((perfil) => perfil.estado === filtroActivo);

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Cola de Revisión
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Panel Administrador / Radar de Afinidad / Cola de Revisión
          </p>
        </div>

        {/* Layout principal */}
        <div className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-lg border border-border bg-surface lg:grid-cols-[420px_1fr]">
          {/* Panel izquierdo */}
          <section className="border-b border-border lg:border-r lg:border-b-0">
            <div className="border-b border-border p-5">
              <h2 className="font-semibold text-ink">
                Perfiles enviados
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Revisa los perfiles enviados para generar su radar de afinidad.
              </p>

              {/* Filtros */}
              <div className="mt-5 flex flex-wrap gap-2">
                {filtros.map((filtro) => {
                  const estaActivo = filtroActivo === filtro;

                  return (
                    <button
                      key={filtro}
                      type="button"
                      onClick={() => setFiltroActivo(filtro)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        estaActivo
                          ? "border-ink bg-ink text-surface"
                          : "border-border bg-surface text-text-secondary hover:bg-surface-soft hover:text-ink"
                      }`}
                    >
                      {filtro}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lista filtrada */}
            <div className="p-5">
              <p className="mb-4 text-sm text-text-secondary">
                Mostrando {perfilesFiltrados.length} perfil(es)
              </p>

              <div className="space-y-3">
                {perfilesFiltrados.map((perfil) => (
                  <article
                    key={perfil.id}
                    className="rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-soft"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-soft text-sm font-semibold text-ink"
                        aria-label={`Avatar de ${perfil.nombre}`}
                      >
                        {obtenerIniciales(perfil.nombre)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            {/* Nombre */}
                            <p className="truncate text-sm font-semibold text-ink">
                              {perfil.nombre}
                            </p>

                            {/* Cargo objetivo */}
                            <p className="mt-1 truncate text-xs text-text-secondary">
                              {perfil.cargoObjetivo}
                            </p>
                          </div>

                          {/* Estado */}
                          <Badge
                            variant="outline"
                            className={obtenerClasesEstado(perfil.estado)}
                          >
                            {perfil.estado}
                          </Badge>
                        </div>

                        <div className="mt-3 flex items-end justify-between gap-3">
                          {/* Fecha exacta de envío */}
                          <div>
                            <p className="text-[11px] text-text-secondary">
                              Fecha de envío
                            </p>

                            <p className="mt-0.5 text-xs font-medium text-ink-soft">
                              {perfil.fechaEnvio}
                            </p>
                          </div>

                          {/* Afinidad global */}
                          <div className="text-right">
                            <p className="text-[11px] text-text-secondary">
                              Afinidad
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-ink">
                              {perfil.afinidadGlobal.toFixed(1)}/10
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Panel derecho - H2-04 */}
          <section className="flex items-center justify-center bg-surface p-8">
            <div className="max-w-sm text-center">
              <h2 className="text-lg font-semibold text-ink">
                Detalle del perfil
              </h2>

              <p className="mt-2 text-sm text-text-secondary">
                Selecciona un perfil de la lista para visualizar su información.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}