import { Shield } from "lucide-react";

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 px-3 py-4">
      <div className="relative flex size-12 shrink-0 items-center justify-center">
        <Shield className="size-12 fill-accent text-surface" strokeWidth={1.5} aria-hidden="true" />
        <span className="absolute font-tight text-xl font-extrabold text-surface">U</span>
      </div>
      <div className="leading-tight">
        <p className="font-tight text-2xl font-extrabold tracking-wide text-surface">UMSSY</p>
        <p className="text-sm text-surface/80">Universidad para el futuro</p>
      </div>
    </div>
  );
}
