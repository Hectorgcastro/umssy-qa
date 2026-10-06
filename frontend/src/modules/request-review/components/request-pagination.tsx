"use client";

import { Button } from "@/components/ui/button";

interface RequestPaginationProps {
  from: number;
  to: number;
  total: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function RequestPagination({ from, to, total, hasPrevious, hasNext, onPrevious, onNext }: RequestPaginationProps) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <p className="text-sm text-text-secondary">
        Mostrando {from} a {to} de {total} solicitudes
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onPrevious} disabled={!hasPrevious}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
