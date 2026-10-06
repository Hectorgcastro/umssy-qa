"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { REJECTION_MAX_LENGTH, REJECTION_REASONS } from "../constants/request-review.constants";
import { requestReviewService } from "../services/request-review.service";
import type { ReviewDetail, ReviewStatus } from "../types/request-review.types";
import { buildRejectionReason } from "../utils/build-rejection-reason";

interface VerdictPanelProps {
  detail: ReviewDetail;
  status: ReviewStatus;
  onStatusChange: (status: ReviewStatus) => void;
}

const APPROVED_MESSAGE = "Solicitud aprobada. Se envió el código de activación al correo del titulado.";
const REJECTED_MESSAGE = "Solicitud rechazada. Se notificó al titulado con el motivo.";
const REJECTED_NO_MAIL_MESSAGE = "Solicitud rechazada, pero no se pudo enviar el correo al titulado.";
const APPROVED_NO_CODE_MESSAGE = "Solicitud aprobada, pero no se pudo enviar el código de activación al correo del titulado.";

export function VerdictPanel({ detail, status, onStatusChange }: VerdictPanelProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [hint, setHint] = useState("");
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

  const rejection = buildRejectionReason(choice, hint);

  async function handleReject() {
    setIsRejecting(true);
    setRejectError(null);
    const result = await requestReviewService.rejectRequest(detail.id, rejection.reason);
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
      setChoice(null);
      setHint("");
      setRejectError(null);
    }
  }

  const REJECT_BUTTON_CLASS =
    "h-[42px] rounded-lg bg-accent px-5 text-[14.5px] font-semibold text-surface hover:bg-accent/90 disabled:bg-border disabled:text-text-secondary disabled:opacity-100";

  return (
    <section className="flex flex-col gap-4 rounded-[10px] border border-border bg-surface p-5" aria-label="Dictamen">
      <h2 className="font-tight text-[17px] font-bold text-ink">Dictamen</h2>

      {status === "in_review" ? (
        <>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={isApproving}
              className="h-[42px] flex-1 rounded-lg bg-ink px-5 text-[14.5px] font-semibold text-surface hover:bg-ink/90"
            >
              <Check strokeWidth={1.75} aria-hidden="true" />
              Aprobar solicitud
            </Button>
            <Button
              variant="outline"
              onClick={() => setRejectOpen(true)}
              disabled={isApproving}
              className="h-[42px] flex-1 rounded-lg border-accent bg-surface px-5 text-[14.5px] font-semibold text-accent hover:bg-interaction hover:text-accent"
            >
              <X strokeWidth={1.75} aria-hidden="true" />
              Rechazar
            </Button>
          </div>
          <p className="text-sm text-text-secondary">
            Revisa el documento y el contraste de datos antes de emitir el dictamen. Al aprobar se genera el código de
            activación de la persona titulada.
          </p>
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
        <AlertDialogContent className="gap-5 rounded-[10px] p-8 data-[size=default]:sm:max-w-[36rem]">
          <AlertDialogHeader className="relative text-left">
            <AlertDialogTitle className="font-tight text-[26px] font-extrabold text-ink">Rechazar solicitud</AlertDialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Cerrar"
              onClick={() => handleRejectOpenChange(false)}
              className="absolute top-0 right-0 text-ink-soft"
            >
              <X strokeWidth={1.75} aria-hidden="true" />
            </Button>
            <AlertDialogDescription className="text-[15px] text-text-secondary">
              {detail.firstName} {detail.lastName} recibirá este motivo por correo ({detail.email}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-4">
            <fieldset className="flex flex-col gap-2">
              <legend className="pb-1 text-sm font-semibold text-ink">Motivo</legend>
              <RadioGroup value={choice ?? ""} onValueChange={(value) => setChoice(value)} aria-label="Motivo">
                {REJECTION_REASONS.map((option, index) => (
                  <Label
                    key={option}
                    htmlFor={`reject-reason-${index}`}
                    className={cn(
                      "flex h-[52px] cursor-pointer items-center gap-3 rounded-lg border px-4 text-[15px] font-normal text-ink",
                      choice === option ? "border-accent bg-interaction" : "border-border bg-surface",
                    )}
                  >
                    <RadioGroupItem
                      id={`reject-reason-${index}`}
                      value={option}
                      className="size-5 border-border-strong data-checked:border-accent data-checked:bg-surface [&_[data-slot=radio-group-indicator]>span]:bg-accent"
                    />
                    {option}
                  </Label>
                ))}
              </RadioGroup>
            </fieldset>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reject-hint" className="font-semibold text-ink">
                Indicación para el solicitante
              </Label>
              <Textarea
                id="reject-hint"
                value={hint}
                onChange={(event) => setHint(event.target.value)}
                placeholder="Explica qué debe corregir la persona"
                className="min-h-24 rounded-lg"
              />
              <p className="text-xs text-text-secondary" aria-live="polite">
                {rejection.length}/{REJECTION_MAX_LENGTH}
              </p>
              {rejection.error && (
                <p role="alert" className="text-sm text-ink">
                  {rejection.error}
                </p>
              )}
              {rejectError && (
                <p role="alert" className="text-sm text-ink">
                  {rejectError}
                </p>
              )}
            </div>
          </div>
          <AlertDialogFooter className="flex-row justify-end gap-3 bg-transparent p-0">
            <AlertDialogCancel type="button" disabled={isRejecting} className="h-[42px] rounded-lg px-5 text-[14.5px] font-semibold">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              type="button"
              disabled={!rejection.isValid || isRejecting}
              className={REJECT_BUTTON_CLASS}
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
