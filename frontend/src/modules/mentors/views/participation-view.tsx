import Link from "next/link";

export function ParticipationView() {
  return (
    <section className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <h1 className="text-2xl font-bold">Mi participación</h1>
      <p>Configura tu participación como mentor y administra tus áreas técnicas.</p>
      <div className="flex flex-wrap gap-4">
        <Link className="rounded-lg bg-accent px-4 py-3 text-white" href="/mentors/participation/technical-areas">
          Editar áreas técnicas
        </Link>
        <Link className="rounded-lg border px-4 py-3" href="/mentorship">
          Configurar participación
        </Link>
        <Link className="rounded-lg border px-4 py-3" href="/mentorship/mentors">
          Buscar mentores
        </Link>
      </div>
    </section>
  );
}
