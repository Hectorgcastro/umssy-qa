"use client";

import { useState } from "react";
import {
  CERTIFICATION_DOCUMENT_MESSAGES,
  DOCUMENT_URL_LIFETIME_MS,
} from "../config/certification-document.config";
import { certificationsService } from "../services/certifications.service";
import type { CertificationDocumentChange } from "../types/certification-document-change.types";
import type { Certification } from "../types/certification.types";
import type { Feedback } from "../types/feedback.types";

export function useCertificationDocument() {
  const [isSaving, setIsSaving] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function applyDocumentChange(
    certificationId: string,
    change: CertificationDocumentChange,
  ): Promise<boolean> {
    if (change.type === "keep") {
      return true;
    }

    const isReplacing = change.type === "replace";
    setIsSaving(true);
    setFeedback(null);
    try {
      if (isReplacing) {
        await certificationsService.uploadDocument(certificationId, change.file);
      } else {
        await certificationsService.deleteDocument(certificationId);
      }
      setFeedback({
        type: "success",
        message: isReplacing
          ? CERTIFICATION_DOCUMENT_MESSAGES.uploadSuccess
          : CERTIFICATION_DOCUMENT_MESSAGES.removeSuccess,
      });
      return true;
    } catch {
      setFeedback({
        type: "error",
        message: isReplacing
          ? CERTIFICATION_DOCUMENT_MESSAGES.uploadError
          : CERTIFICATION_DOCUMENT_MESSAGES.removeError,
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function openDocument(certification: Certification): Promise<void> {
    const documentTab = window.open("", "_blank");
    setIsOpening(true);
    setFeedback(null);
    try {
      const file = await certificationsService.getDocument(certification.id);
      if (!file) {
        documentTab?.close();
        setFeedback({ type: "error", message: CERTIFICATION_DOCUMENT_MESSAGES.notFound });
        return;
      }
      const fileUrl = URL.createObjectURL(file);
      if (documentTab) {
        documentTab.location.href = fileUrl;
      } else {
        window.open(fileUrl, "_blank");
      }
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), DOCUMENT_URL_LIFETIME_MS);
    } catch {
      documentTab?.close();
      setFeedback({ type: "error", message: CERTIFICATION_DOCUMENT_MESSAGES.openError });
    } finally {
      setIsOpening(false);
    }
  }

  function clearFeedback() {
    setFeedback(null);
  }

  return { applyDocumentChange, openDocument, isSaving, isOpening, feedback, clearFeedback };
}
