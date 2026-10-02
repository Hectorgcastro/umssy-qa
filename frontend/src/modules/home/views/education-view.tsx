"use client";

import type { FormEvent } from "react";

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  periodLabel: string;
}

interface ProfileTab {
  label: string;
  isActive: boolean;
}

interface TextFieldProps {
  name: "institution" | "degree" | "startDate" | "endDate";
  label: string;
  placeholder: string;
}

const MOCK_EDUCATIONS: EducationItem[] = [
  {
    id: "mock-1",
    degree: "Ingeniería Informática",
    institution: "Universidad Mayor de San Simón",
    periodLabel: "2021 – 2026",
  },
  {
    id: "mock-2",
    degree: "Bachiller en Humanidades",
    institution: "Unidad Educativa Avelino Siñani",
    periodLabel: "2015 – 2020",
  },
];

const PROFILE_TABS: ProfileTab[] = [
  { label: "Datos personales", isActive: false },
  { label: "Presentación", isActive: false },
  { label: "Trayectoria", isActive: true },
  { label: "Documentos", isActive: false },
];

const FOCUS_RING_CLASSES =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const LABEL_CLASSES = "text-[12.5px] font-semibold text-ink";

const INPUT_CLASSES =
  "w-full rounded-md border border-border bg-surface px-3.5 text-[15px] text-ink " +
  "placeholder:text-text-secondary/80 transition-colors " +
  "focus:border-accent focus:bg-interaction focus:outline-hidden focus:ring-2 focus:ring-accent/20 " +
  "user-invalid:border-accent";

function TextField({ name, label, placeholder }: TextFieldProps) {
  const inputId = `education-${name}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className={LABEL_CLASSES}>
        {label} <span className="text-accent">*</span>
      </label>
      <input
        id={inputId}
        name={name}
        type="text"
        required
        placeholder={placeholder}
        className={`h-10 ${INPUT_CLASSES}`}
      />
    </div>
  );
}

export function EducationView() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  return (
    <main className="min-h-screen bg-surface-soft px-4 py-8 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="font-extrabold text-2xl tracking-tight text-ink sm:text-3xl">
            Formación académica
          </h1>
          <p className="mt-1.5 text-[15px] font-normal text-text-secondary">
            Muestra tus estudios, títulos y las fechas en que cursaste cada
            formación.
          </p>
        </header>

        <nav
          aria-label="Secciones del perfil"
          className="mb-6 border-b border-border"
        >
          <ul className="flex flex-wrap gap-6">
            {PROFILE_TABS.map((tab) => (
              <li key={tab.label}>
                <button
                  type="button"
                  aria-current={tab.isActive ? "page" : undefined}
                  className={`relative pb-3 text-[14px] font-semibold transition-colors ${FOCUS_RING_CLASSES} ${
                    tab.isActive
                      ? "border-b-2 border-accent text-ink"
                      : "text-text-secondary hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <section
            aria-labelledby="registered-education-heading"
            className="rounded-lg border border-border bg-surface p-6"
          >
            <span
              aria-hidden="true"
              className="mb-3 block h-0.5 w-6 bg-current text-gold"
            />
            <h2
              id="registered-education-heading"
              className="font-bold text-lg text-ink"
            >
              Formación registrada
            </h2>
            <p className="mt-1 text-[13.5px] font-normal text-text-secondary">
              Puedes agregar varias entradas y actualizar cada una.
            </p>

            <ul className="mt-5 divide-y divide-border">
              {MOCK_EDUCATIONS.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-2"
                >
                  <div>
                    <h3 className="font-bold text-[15px] text-ink">
                      {item.degree}
                    </h3>
                    <p className="mt-0.5 text-[13.5px] font-normal text-text-secondary">
                      {item.institution} · {item.periodLabel}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Editar ${item.degree}`}
                      className={`rounded px-1.5 py-1 text-[13px] font-semibold text-ink transition-colors hover:bg-surface-soft ${FOCUS_RING_CLASSES}`}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      aria-label={`Eliminar ${item.degree}`}
                      className={`rounded px-1.5 py-1 text-[13px] font-semibold text-accent transition-colors hover:bg-interaction ${FOCUS_RING_CLASSES}`}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-4 border-t border-border pt-4 text-[13px] font-normal text-text-secondary">
              Los nuevos estudios aparecerán aquí después de guardar.
            </p>
          </section>

          <section
            aria-labelledby="add-education-heading"
            className="rounded-lg border border-border bg-surface p-6"
          >
            <span
              aria-hidden="true"
              className="mb-3 block h-0.5 w-6 bg-current text-gold"
            />
            <h2
              id="add-education-heading"
              className="font-bold text-lg text-ink"
            >
              Agregar formación
            </h2>

            <form
              aria-label="Agregar formación"
              noValidate
              onSubmit={handleSubmit}
              className="mt-5 flex flex-col gap-4"
            >
              <TextField
                name="institution"
                label="Institución"
                placeholder="Nombre de la institución"
              />

              <TextField
                name="degree"
                label="Título o carrera"
                placeholder="Ej. Licenciatura en Informática"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  name="startDate"
                  label="Desde"
                  placeholder="Mes y año"
                />
                <TextField
                  name="endDate"
                  label="Hasta"
                  placeholder="Mes y año"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="education-description" className={LABEL_CLASSES}>
                  Descripción (opcional)
                </label>
                <textarea
                  id="education-description"
                  name="description"
                  rows={3}
                  placeholder="Agrega un detalle relevante de tus estudios"
                  className={`py-2.5 ${INPUT_CLASSES}`}
                />
              </div>

              <div className="mt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  className={`rounded-md border border-border bg-surface px-4 py-2.5 text-[14px] font-semibold text-text-secondary transition-colors hover:bg-surface-soft hover:text-ink active:bg-interaction ${FOCUS_RING_CLASSES}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`rounded-md bg-accent px-4 py-2.5 text-[14px] font-semibold text-surface transition-opacity hover:opacity-95 ${FOCUS_RING_CLASSES}`}
                >
                  Guardar formación
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}