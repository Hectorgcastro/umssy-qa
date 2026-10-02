import { Info } from "lucide-react";

type ModulePlaceholderProps = {
  title: string;
};

export function ModulePlaceholder({ title }: ModulePlaceholderProps) {
  return (
    <section
      aria-labelledby="module-title"
      className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-white text-text-secondary shadow-sm">
        <Info aria-hidden="true" className="size-5" />
      </div>
      <h1 id="module-title" className="mt-5 text-2xl font-bold text-ink">
        {title}
      </h1>
      <p className="mt-2 text-sm text-text-secondary">En desarrollo</p>
    </section>
  );
}