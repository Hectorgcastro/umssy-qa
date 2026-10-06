"use client";

import { useState } from "react";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type EstadoPerfil = "Completado" | "Procesando" | "Pendiente";
type Filtro = "Todos" | EstadoPerfil;

type NivelAfinidad = "Experto" | "Avanzado" | "Intermedio" | "Base";

type AreaAfinidad = {
  area: string;
  nivel: NivelAfinidad;
  puntuacion: number;
};

type Perfil = {
  id: number;
  nombre: string;
  cargoObjetivo: string;
  fechaEnvio: string;
  afinidadGlobal: number;
  estado: EstadoPerfil;
  areas: AreaAfinidad[];
};

const perfiles: Perfil[] = [
  {
    id: 1,
    nombre: "Ana Martínez",
    cargoObjetivo: "Full Stack Developer",
    fechaEnvio: "05/10/2026 18:20",
    afinidadGlobal: 8.5,
    estado: "Completado",
    areas: [
      { area: "Desarrollo", nivel: "Experto", puntuacion: 9 },
      { area: "Cloud/DevOps", nivel: "Experto", puntuacion: 8.5 },
      { area: "Data/AI", nivel: "Experto", puntuacion: 8 },
      { area: "QA", nivel: "Experto", puntuacion: 8.5 },
      { area: "Ciberseguridad", nivel: "Experto", puntuacion: 8 },
      { area: "Gobernanza TI", nivel: "Experto", puntuacion: 9 },
    ],
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    cargoObjetivo: "DevOps Engineer",
    fechaEnvio: "05/10/2026 17:45",
    afinidadGlobal: 7.3,
    estado: "Procesando",
    areas: [
      { area: "Desarrollo", nivel: "Avanzado", puntuacion: 7 },
      { area: "Cloud/DevOps", nivel: "Experto", puntuacion: 9 },
      { area: "Data/AI", nivel: "Avanzado", puntuacion: 7 },
      { area: "QA", nivel: "Avanzado", puntuacion: 7.5 },
      { area: "Ciberseguridad", nivel: "Avanzado", puntuacion: 7 },
      { area: "Gobernanza TI", nivel: "Intermedio", puntuacion: 6.3 },
    ],
  },
  {
    id: 3,
    nombre: "María López",
    cargoObjetivo: "Data Analyst",
    fechaEnvio: "05/10/2026 16:30",
    afinidadGlobal: 6.8,
    estado: "Pendiente",
    areas: [
      { area: "Desarrollo", nivel: "Avanzado", puntuacion: 6.5 },
      { area: "Cloud/DevOps", nivel: "Intermedio", puntuacion: 6 },
      { area: "Data/AI", nivel: "Experto", puntuacion: 9 },
      { area: "QA", nivel: "Avanzado", puntuacion: 6.5 },
      { area: "Ciberseguridad", nivel: "Intermedio", puntuacion: 6 },
      { area: "Gobernanza TI", nivel: "Avanzado", puntuacion: 6.8 },
    ],
  },
  {
    id: 4,
    nombre: "Diego Fernández",
    cargoObjetivo: "QA Engineer",
    fechaEnvio: "05/10/2026 15:10",
    afinidadGlobal: 6.2,
    estado: "Pendiente",
    areas: [
      { area: "Desarrollo", nivel: "Intermedio", puntuacion: 6 },
      { area: "Cloud/DevOps", nivel: "Intermedio", puntuacion: 5.5 },
      { area: "Data/AI", nivel: "Intermedio", puntuacion: 5.5 },
      { area: "QA", nivel: "Experto", puntuacion: 9 },
      { area: "Ciberseguridad", nivel: "Intermedio", puntuacion: 5.5 },
      { area: "Gobernanza TI", nivel: "Intermedio", puntuacion: 5.7 },
    ],
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

function obtenerClaseNivel(nivel: NivelAfinidad) {
  switch (nivel) {
    case "Experto":
      return "bg-accent";

    case "Avanzado":
      return "bg-gold";

    case "Intermedio":
      return "bg-ink-soft";

    case "Base":
      return "bg-border-strong";
  }
}

function AffinityRadarChart({
  areas,
  promedio,
}: {
  areas: AreaAfinidad[];
  promedio: number;
}) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">
            Radar de Afinidad
          </h3>

          <p className="mt-1 text-xs text-text-secondary">
            {areas.length} áreas evaluadas
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-accent">
            {promedio.toFixed(2)}
          </p>

          <p className="text-[9px] uppercase tracking-widest text-text-secondary">
            Promedio
          </p>
        </div>
      </div>

      <div className="h-[330px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={areas} outerRadius="65%">
            <PolarGrid stroke="var(--color-border)" />

            <PolarAngleAxis
              dataKey="area"
              tick={{
                fill: "var(--color-text-secondary)",
                fontSize: 11,
              }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tickCount={6}
              axisLine={false}
              tick={{
                fill: "var(--color-text-secondary)",
                fontSize: 9,
              }}
            />

            <Radar
              name="Profile Affinity Score"
              dataKey="puntuacion"
              stroke="var(--color-accent)"
              strokeWidth={2}
              fill="var(--color-accent)"
              fillOpacity={0.15}
              dot={{
                r: 4,
                fill: "var(--color-accent)",
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <span className="h-2.5 w-5 rounded-sm bg-interaction" />
        Profile Affinity Score
      </div>
    </section>
  );
}

function AreaBreakdownPanel({
  areas,
  media,
}: {
  areas: AreaAfinidad[];
  media: number;
}) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold text-ink">
        Desglose por Área
      </h3>

      <p className="mt-1 text-xs text-text-secondary">
        Puntuación obtenida en cada dimensión
      </p>

      <ul className="mt-5 space-y-4">
        {areas.map((area) => (
          <li key={area.area}>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`h-1.5 w-1.5 rounded-full ${obtenerClaseNivel(
                  area.nivel,
                )}`}
              />

              <span className="text-ink">{area.area}</span>

              <span className="ml-auto text-[10px] text-text-secondary">
                {area.nivel}
              </span>

              <span className="w-8 text-right font-semibold text-ink">
                {area.puntuacion.toFixed(1)}
              </span>
            </div>

            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-soft">
              <div
                className={`h-full rounded-full ${obtenerClaseNivel(
                  area.nivel,
                )}`}
                style={{
                  width: `${area.puntuacion * 10}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-baseline justify-between border-t border-border pt-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
          Media global
        </span>

        <span className="text-xl font-bold text-accent">
          {media.toFixed(2)}

          <span className="ml-1 text-[10px] font-normal text-text-secondary">
            / 10
          </span>
        </span>
      </div>
    </section>
  );
}

export default function ColaRevisionPage() {
  const [filtroActivo, setFiltroActivo] = useState<Filtro>("Todos");

  const [perfilSeleccionado, setPerfilSeleccionado] =
    useState<Perfil | null>(null);

  const [accionLocal, setAccionLocal] = useState<
    "aprobado" | "rechazado" | null
  >(null);

  const perfilesFiltrados =
    filtroActivo === "Todos"
      ? perfiles
      : perfiles.filter((perfil) => perfil.estado === filtroActivo);

  const mostrarAcciones =
    perfilSeleccionado !== null &&
    perfilSeleccionado.estado !== "Completado";

  function cambiarFiltro(filtro: Filtro) {
    setFiltroActivo(filtro);
    setAccionLocal(null);

    if (
      perfilSeleccionado &&
      filtro !== "Todos" &&
      perfilSeleccionado.estado !== filtro
    ) {
      setPerfilSeleccionado(null);
    }
  }

  function seleccionarPerfil(perfil: Perfil) {
    setPerfilSeleccionado(perfil);
    setAccionLocal(null);
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Cola de Revisión
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Panel Administrador / Radar de Afinidad / Cola de Revisión
          </p>
        </div>

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

              <div className="mt-5 flex flex-wrap gap-2">
                {filtros.map((filtro) => {
                  const estaActivo = filtroActivo === filtro;

                  return (
                    <button
                      key={filtro}
                      type="button"
                      onClick={() => cambiarFiltro(filtro)}
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

            <div className="p-5">
              <p className="mb-4 text-sm text-text-secondary">
                Mostrando {perfilesFiltrados.length} perfil(es)
              </p>

              <div className="space-y-3">
                {perfilesFiltrados.map((perfil) => {
                  const estaSeleccionado =
                    perfilSeleccionado?.id === perfil.id;

                  return (
                    <button
                      key={perfil.id}
                      type="button"
                      onClick={() => seleccionarPerfil(perfil)}
                      aria-pressed={estaSeleccionado}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        estaSeleccionado
                          ? "border-accent bg-interaction"
                          : "border-border bg-surface hover:bg-surface-soft"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-soft text-sm font-semibold text-ink"
                          aria-label={`Avatar de ${perfil.nombre}`}
                        >
                          {obtenerIniciales(perfil.nombre)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-ink">
                                {perfil.nombre}
                              </p>

                              <p className="mt-1 truncate text-xs text-text-secondary">
                                {perfil.cargoObjetivo}
                              </p>
                            </div>

                            <Badge
                              variant="outline"
                              className={obtenerClasesEstado(perfil.estado)}
                            >
                              {perfil.estado}
                            </Badge>
                          </div>

                          <div className="mt-3 flex items-end justify-between gap-3">
                            <div>
                              <p className="text-[11px] text-text-secondary">
                                Fecha de envío
                              </p>

                              <p className="mt-0.5 text-xs font-medium text-ink-soft">
                                {perfil.fechaEnvio}
                              </p>
                            </div>

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
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Panel derecho */}
          <section className="bg-surface p-6 lg:p-8">
            {perfilSeleccionado ? (
              <div className="mx-auto w-full max-w-3xl">
                {/* Cabecera del perfil */}
                <div className="flex items-start gap-4 border-b border-border pb-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-soft text-sm font-semibold text-ink">
                    {obtenerIniciales(perfilSeleccionado.nombre)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-ink">
                          {perfilSeleccionado.nombre}
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                          {perfilSeleccionado.cargoObjetivo}
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className={obtenerClasesEstado(
                          perfilSeleccionado.estado,
                        )}
                      >
                        {perfilSeleccionado.estado}
                      </Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-secondary">
                      <span>
                        Enviado: {perfilSeleccionado.fechaEnvio}
                      </span>

                      <span className="font-semibold text-ink">
                        Afinidad global:{" "}
                        {perfilSeleccionado.afinidadGlobal.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Radar y desglose */}
                <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_280px]">
                  <AffinityRadarChart
                    areas={perfilSeleccionado.areas}
                    promedio={perfilSeleccionado.afinidadGlobal}
                  />

                  <AreaBreakdownPanel
                    areas={perfilSeleccionado.areas}
                    media={perfilSeleccionado.afinidadGlobal}
                  />
                </div>

                {/* Acciones H2-05 */}
                {mostrarAcciones && (
                  <div className="mt-6 border-t border-border pt-5">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={() => setAccionLocal("aprobado")}
                      >
                        Aprobar y publicar radar
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => setAccionLocal("rechazado")}
                      >
                        Rechazar envío
                      </Button>
                    </div>

                    {accionLocal && (
                      <div
                        role="status"
                        className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                          accionLocal === "aprobado"
                            ? "border-border bg-surface-soft text-ink"
                            : "border-destructive/20 bg-destructive/10 text-destructive"
                        }`}
                      >
                        {accionLocal === "aprobado"
                          ? "Radar aprobado localmente. No se enviaron datos al backend."
                          : "Envío rechazado localmente. No se modificaron datos persistentes."}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full min-h-[500px] items-center justify-center">
                <div className="max-w-sm text-center">
                  <h2 className="text-lg font-semibold text-ink">
                    Detalle del perfil
                  </h2>

                  <p className="mt-2 text-sm text-text-secondary">
                    Selecciona un perfil de la lista para visualizar su
                    información.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}