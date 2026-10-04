"use client";

import Link from "next/link";

export function HomeView() {
  return (
    <div className="min-h-full w-full flex-1 bg-surface-soft text-foreground flex flex-col items-center justify-center px-6 gap-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink text-center">
        Bienvenido a UMSSY
      </h1>

      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90"
      >
        Iniciar sesión
      </Link>
    </div>
  );
}