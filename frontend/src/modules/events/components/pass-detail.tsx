import { MapPin, WifiOff, QrCode } from "lucide-react";

export function PassDetail() {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Tarjeta del QR */}
      <div className="bg-ink text-surface p-8 rounded-[24px] flex flex-col gap-6 shadow-sm">
        {/* Etiqueta Oficial */}
        <div className="flex items-center gap-2 text-gold text-[11px] font-bold tracking-widest uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
          Pase UMSS - Oficial
        </div>

        {/* Título y Fecha */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[22px] font-bold leading-tight">Desarrollo Web con React</h2>
          <p className="text-surface-soft/70 text-sm">jueves, 15 de octubre · 09:00 - 13:00</p>
        </div>

        {/* Ubicación */}
        <div className="flex items-center gap-2 text-surface-soft/70 text-sm">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>Lab Informática 3, Edificio Central</span>
        </div>

        {/* Contenedor del QR */}
        <div className="bg-surface rounded-3xl p-6 mt-2 flex items-center justify-center">
          <QrCode className="w-full h-auto max-w-[220px] text-ink opacity-90" strokeWidth={1} />
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center mt-2 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-surface-soft/50 uppercase tracking-widest">ID Inscripción</span>
            <span className="font-bold text-sm">202-T1-REAC</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-[10px] text-surface-soft/50 uppercase tracking-widest">Estado</span>
            <span className="font-bold text-gold text-sm flex items-center gap-1 justify-end">
              ✓ Confirmado
            </span>
          </div>
        </div>
      </div>

      {/* Alerta de Modo Offline */}
      <div className="bg-interaction rounded-[20px] p-5 flex gap-3.5 items-start border border-danger/10 text-danger">
        <WifiOff className="w-5 h-5 shrink-0 mt-0.5 opacity-90" />
        <div className="flex flex-col gap-1">
          <span className="font-bold text-sm">Disponible sin conexión</span>
          <span className="text-[13px] opacity-80 leading-relaxed">
            QR generado en tu dispositivo con datos locales. No necesitas internet.
          </span>
        </div>
      </div>
    </div>
  );
}