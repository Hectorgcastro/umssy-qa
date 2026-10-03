"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ORIENTATION_TYPES } from "@/modules/mentorship/data/orientation-types";

const KEY = "umssy-mentor-orientation-types";
export function OrientationTypesView() {
  const [selected, setSelected] = useState<string[]>(["technical-guidance", "career-guidance"]);
  const [saved, setSaved] = useState(false);
  useEffect(() => { const raw = localStorage.getItem(KEY); if (raw) setSelected(JSON.parse(raw)); }, []);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const save = () => { localStorage.setItem(KEY, JSON.stringify(selected)); setSaved(true); };
  return <main className="min-h-full bg-surface-soft px-4 py-6 sm:py-8"><section className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-5 shadow-sm sm:p-8"><p className="text-xs text-text-secondary">UMSSY › Mentorías › Mi participación</p><h1 className="mt-2 text-2xl font-bold text-ink">Editar tipos de orientación</h1><p className="mt-1 text-sm text-text-secondary">Selecciona las orientaciones que ofrecerás a otros titulados.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{ORIENTATION_TYPES.map((item) => <button key={item.id} type="button" aria-pressed={selected.includes(item.id)} onClick={() => toggle(item.id)} className={`rounded-md border p-4 text-left text-sm font-semibold ${selected.includes(item.id) ? "border-accent bg-accent/10 text-accent" : "border-border text-ink"}`}>{item.label}</button>)}</div>{saved && <p className="mt-4 text-sm text-emerald-700">Cambios guardados.</p>}<div className="mt-6 flex gap-3"><Link href="/mentors/participation" className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-ink">Cancelar</Link><button type="button" onClick={save} className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white">Guardar cambios</button></div></section></main>;
}
