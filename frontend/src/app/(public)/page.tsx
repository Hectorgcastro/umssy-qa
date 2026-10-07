import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Epic3Shell } from "@/modules/radar-chart";

type Screen = {
  href: string;
  title: string;
  criteria: string;
};

type Story = {
  id: string;
  name: string;
  screens: Screen[];
};

const STORIES: Story[] = [
  {
    id: "HU-1",
    name: "Radar de afinidad del egresado",
    screens: [
      {
        href: "/perfil/radar",
        title: "Radar de afinidad",
        criteria: "H1-01 a H1-05",
      },
    ],
  },
  {
    id: "HU-2",
    name: "Cola de revisión",
    screens: [
      {
        href: "/affinity-radar/review-queue",
        title: "Cola de revisión",
        criteria: "H2-01 a H2-05",
      },
    ],
  },
  {
    id: "HU-3",
    name: "Pendiente de integración",
    screens: [],
  },
  {
    id: "HU-4",
    name: "Detalle por área",
    screens: [
      {
        href: "/area-detail-interaction-preview",
        title: "Interacción completa",
        criteria: "H4-03 a H4-05",
      },
      {
        href: "/area-detail-preview",
        title: "Panel de detalle",
        criteria: "H4-01 y H4-02",
      },
    ],
  },
];

const CARD_CLASS = "rounded-2xl border border-border bg-surface p-5";

function Epic3Index() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-8 sm:py-16">
        <header className="border-b border-border pb-8">
          <span className="block h-1 w-10 rounded-full bg-accent" aria-hidden="true" />
          <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Epic 3 · Radar de Afinidad
          </h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            Entorno de revisión para QA · datos estáticos
          </p>
        </header>

        {STORIES.map((story) => {
          const headingId = `story-${story.id}`;
          const isPending = story.screens.length === 0;

          return (
            <section key={story.id} aria-labelledby={headingId} className="flex flex-col gap-3">
              <h2
                id={headingId}
                className="font-heading text-lg font-bold tracking-tight text-ink"
              >
                <span className="text-accent">{story.id}</span>
                {!isPending && ` · ${story.name}`}
              </h2>

              {isPending ? (
                <div
                  aria-disabled="true"
                  className={`${CARD_CLASS} cursor-not-allowed border-dashed bg-surface-soft text-sm text-text-secondary`}
                >
                  {story.name}
                </div>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {story.screens.map((screen) => (
                    <li key={screen.href}>
                      <Link
                        href={screen.href}
                        className={`${CARD_CLASS} group flex h-full items-center gap-4 outline-none hover:border-border-strong focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 motion-safe:transition-colors`}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-heading text-base font-bold text-ink">
                            {screen.title}
                          </span>
                          <span className="mt-1 block text-sm text-text-secondary tabular-nums">
                            {screen.criteria}
                          </span>
                          <span className="mt-3 block truncate text-xs text-text-secondary">
                            {screen.href}
                          </span>
                        </span>
                        <ArrowRight
                          className="size-4 shrink-0 text-text-secondary group-hover:text-accent motion-safe:transition-colors"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Epic3Shell>
      <Epic3Index />
    </Epic3Shell>
  );
}
