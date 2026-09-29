import { Shield } from "lucide-react";

export function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-12 w-11 shrink-0 items-center justify-center">
        <Shield
          aria-hidden="true"
          className="absolute inset-0 h-full w-full fill-accent text-accent"
          strokeWidth={1}
        />
        <span className="relative font-tight text-2xl font-extrabold text-white">
          U
        </span>
      </div>
      <div className="leading-tight">
        <p className="font-tight text-xl font-extrabold tracking-wide text-white">
          UMSSY
        </p>
        <p className="text-xs text-white/60">Universidad</p>
        <p className="text-xs text-white/60">para el futuro</p>
      </div>
    </div>
  );
}
