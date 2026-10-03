import { Calendar } from "lucide-react";

interface PassCardProps {
  title: string;
  date: string;
  status: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PassCard({ title, date, status, isSelected, onClick }: PassCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-[20px] transition-all flex flex-col gap-4 ${
        isSelected 
          ? "bg-ink text-surface" 
          : "bg-surface text-ink border border-border hover:border-border-strong"
      }`}
    >
      <div className={`text-xs font-semibold px-2.5 py-1 rounded-md w-fit flex items-center gap-1.5 ${
        isSelected ? "bg-white/10 text-gold" : "bg-surface-soft text-text-secondary"
      }`}>
        <span className="text-[10px]">✓</span> {status}
      </div>
      
      <div>
        <h3 className="font-bold text-[17px] leading-tight mb-1">{title}</h3>
        <div className={`flex items-center gap-2 text-[13px] ${
          isSelected ? "text-surface-soft/80" : "text-text-secondary"
        }`}>
          <Calendar className="w-4 h-4 opacity-70" />
          <span>{date}</span>
        </div>
      </div>
    </button>
  );
}