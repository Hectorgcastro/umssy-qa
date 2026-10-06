"use client";

import { useState } from "react";

type EstadoPerfil = "Completado" | "Procesando" | "Pendiente";
type Filtro = "Todos" | EstadoPerfil;

type Perfil = {
  id: number;
  nombre: string;
  estado: EstadoPerfil;
};

const perfiles: Perfil[] = [
  {
    id: 1,
    nombre: "Ana Martínez",
    estado: "Completado",
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    estado: "Procesando",
  },
  {
    id: 3,
    nombre: "María López",
    estado: "Pendiente",
  },
  {
    id: 4,
    nombre: "Diego Fernández",
    estado: "Pendiente",
  },
];

const filtros: Filtro[] = [
  "Todos",
  "Completado",
  "Procesando",
  "Pendiente",
];

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
          <h1 className="text-2xl font-semibold tracking-tight">
            Cola de Revisión
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Panel Administrador / Radar de Afinidad / Cola de Revisión
          </p>
        </div>

        {/* Layout principal */}
        <div className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-lg border bg-card lg:grid-cols-[420px_1fr]">
          {/* Panel izquierdo */}
          <section className="border-b lg:border-b-0 lg:border-r">
            <div className="border-b p-5">
              <h2 className="font-semibold">Perfiles enviados</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Revisa los perfiles enviados para generar su radar de afinidad.
              </p>

              {/* Filtros */}
              <div className="mt-5 flex flex-wrap gap-2">
                {filtros.map((filtro) => (
                  <button
                    key={filtro}
                    type="button"
                    onClick={() => setFiltroActivo(filtro)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      filtroActivo === filtro
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {filtro}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista filtrada */}
            <div className="p-5">
              <p className="mb-4 text-sm text-muted-foreground">
                Mostrando {perfilesFiltrados.length} perfil(es)
              </p>

              <div className="space-y-2">
                {perfilesFiltrados.map((perfil) => (
                  <div
                    key={perfil.id}
                    className="rounded-md border p-3"
                  >
                    <p className="text-sm font-medium">{perfil.nombre}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {perfil.estado}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Panel derecho */}
          <section className="flex items-center justify-center p-8">
            <div className="max-w-sm text-center">
              <h2 className="text-lg font-semibold">Detalle del perfil</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Selecciona un perfil de la lista para visualizar su información.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}