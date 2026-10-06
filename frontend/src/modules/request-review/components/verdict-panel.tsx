"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
const REJECT_MAX_LENGTH = 500;
const REJECTED_MESSAGE = "Solicitud rechazada. Se notificó al titulado con el motivo.";
const REJECTED_NO_MAIL_MESSAGE = "Solicitud rechazada, pero no se pudo enviar el correo al titulado.";
const APPROVED_NO_CODE_MESSAGE = "Solicitud aprobada, pero no se pudo enviar el código de activación al correo del titulado.";

export function VerdictPanel({ detail, status, onStatusChange }: VerdictPanelProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectError, setRejectError] = useState<string | null>(null);
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

  async function handleReject() {
    setIsRejecting(true);
    setRejectError(null);
    const result = await requestReviewService.rejectRequest(detail.id, reason.trim());
    setIsRejecting(false);
    if (result.ok) {
      setRejectOpen(false);
      setMessage(result.data.notificationSent ? REJECTED_MESSAGE : REJECTED_NO_MAIL_MESSAGE);
      onStatusChange("rejected");
    } else {
      setRejectError(result.message);
    }
  }

  function handleRejectOpenChange(open: boolean) {
    if (isRejecting) return;
    setRejectOpen(open);
    if (!open) {
      setReason("");
      setRejectError(null);
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4" aria-label="Dictamen">
      <h2 className="text-lg font-semibold text-ink">Dictamen</h2>

      {status === "in_review" ? (
        <>
          <p className="text-sm text-text-secondary">Revisa el documento y el contraste de datos antes de emitir el dictamen.</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setConfirmOpen(true)} disabled={isApproving}>
              Aprobar solicitud
            </Button>
            <Button variant="outline" onClick={() => setRejectOpen(true)} disabled={isApproving}>
              Rechazar
            </Button>
          </div>
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

      <AlertDialog open={rejectOpen} onOpenChange={handleRejectOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar solicitud</AlertDialogTitle>
            <AlertDialogDescription>
              Indica el motivo. Se enviará al titulado ({detail.email}) para que sepa qué corregir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reject-reason">Motivo del rechazo</Label>
            <Textarea
              id="reject-reason"
              value={reason}
              maxLength={REJECT_MAX_LENGTH}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explica qué debe corregir la persona"
            />
            {rejectError && (
              <p role="alert" className="text-sm text-ink">
                {rejectError}
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={isRejecting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              type="button"
              disabled={reason.trim().length === 0 || isRejecting}
              onClick={(event) => {
                event.preventDefault();
                void handleReject();
              }}
            >
              {isRejecting ? "Rechazando..." : "Rechazar y notificar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
