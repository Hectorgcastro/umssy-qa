import Image from "next/image";

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 px-3 py-4">
      <div className="flex shrink-0 items-center justify-center rounded-md bg-surface p-1.5">
        <Image
          src="/umss-logo.svg"
          alt="Escudo de la Universidad Mayor de San Simón"
          width={48}
          height={73}
          className="h-[73px] w-12 object-contain"
          unoptimized
        />
      </div>
      <div className="leading-tight">
        <p className="font-tight text-2xl font-extrabold tracking-wide text-surface">UMSS</p>
        <p className="mt-1 text-sm font-semibold text-surface">Universidad Mayor de San Simón</p>
        <p className="mt-1 text-xs text-surface/80">Ciencia y conocimiento desde 1832</p>
      </div>
    </div>
  );
}
