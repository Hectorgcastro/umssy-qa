const STEPS = [
  { number: 1, label: "Tus datos" },
  { number: 2, label: "Documento de respaldo" },
  { number: 3, label: "Revisión de la carrera" },
  { number: 4, label: "Activación de cuenta" },
];

export function AccessRequestSidebar() {
  return (
    <aside className="flex min-h-[220px] w-full flex-col bg-[#0B1F2E] px-6 py-8 text-white md:min-h-screen md:w-80 md:px-8">
      <div className="mb-10">
        <p className="text-sm font-semibold tracking-wide">UMSS</p>

        <h2 className="mt-2 text-2xl font-bold">
          Solicitud de acceso
        </h2>

        <p className="mt-2 text-sm text-white/70">
          Completa los pasos para solicitar tu cuenta.
        </p>
      </div>

      <nav className="space-y-3">
        {STEPS.map((step) => {
          const isActive = step.number === 1;

          return (
            <div
              key={step.number}
              className={`flex items-center gap-4 rounded-lg px-4 py-3 ${
                isActive
                  ? "bg-[#FDECED] text-[#0B1F2E]"
                  : "text-white/70"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive
                    ? "bg-[#E30613] text-white"
                    : "border border-white/30"
                }`}
              >
                {step.number}
              </div>

              <span className="text-sm font-semibold">
                {step.label}
              </span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}