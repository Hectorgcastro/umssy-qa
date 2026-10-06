import type { MatchScoreProps } from "../types/match-score-props.types";

export function MatchScoreBar({ value }: MatchScoreProps) {
  const score = Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-3 text-sm font-medium"><span>Compatibilidad</span><span>{score}%</span></div>
      <div role="progressbar" aria-label="Compatibilidad" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-accent transition-all" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
