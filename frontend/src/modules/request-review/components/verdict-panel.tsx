"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { requestReviewService } from "../services/request-review.service";
import type { ReviewDetail, ReviewStatus } from "../types/request-review.types";

interface VerdictPanelProps {
  detail: ReviewDetail;
  status: ReviewStatus;
  onStatusChange: (status: ReviewStatus) => void;
}

const APPROVED_MESSAGE = "Solicitud aprobada. Se envió el código de activación al correo del titulado.";
const APPROVED_NO_CODE_MESSAGE = "Solicitud aprobada, pero no se pudo enviar el código de activación al correo del titulado.";

export function VerdictPanel({ detail, status, onStatusChange }: VerdictPanelProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setIsApproving(true);
    setError(null);
    const result = await requestReviewService.approveRequest(detail.id);
    setIsApproving(false);
    setConfirmOpen(false);
    if (result.ok) {
      setMessage(result.data.activationCodeSent ? APPROVED_MESSAGE : APPROVED_NO_CODE_MESSAGE);
      onStatusChange("approved");
    } else {
      setError(result.message);
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4" aria-label="Dictamen">
      <h2 className="text-lg font-semibold text-ink">Dictamen</h2>

      {status === "in_review" ? (
        <>
          <p className="text-sm text-text-secondary">Revisa el documento y el contraste de datos antes de emitir el dictamen.</p>
          <Button onClick={() => setConfirmOpen(true)} disabled={isApproving}>
            Aprobar solicitud
          </Button>
        </>
      ) : (
        <p className="text-sm text-text-secondary">Esta solicitud ya no admite un dictamen.</p>
      )}

      {message && (
        <p role="status" className="text-sm text-ink">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-ink">
          {error}
        </p>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Aprobar la solicitud?</AlertDialogTitle>
            <AlertDialogDescription>
              Se enviará el código de activación al correo del titulado ({detail.email}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={isApproving}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              type="button"
              disabled={isApproving}
              onClick={(event) => {
                event.preventDefault();
                void handleApprove();
              }}
            >
              {isApproving ? "Aprobando..." : "Aprobar y enviar código"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
