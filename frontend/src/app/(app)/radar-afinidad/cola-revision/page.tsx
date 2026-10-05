export default function ColaRevisionPage() {
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
            </div>

            <div className="p-5">
              <p className="text-sm text-muted-foreground">
                La lista de perfiles aparecerá aquí.
              </p>
            </div>
          </section>

          {/* Panel derecho */}
          <section className="flex items-center justify-center p-8">
            <div className="max-w-sm text-center">
              <h2 className="text-lg font-semibold">
                Detalle del perfil
              </h2>

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