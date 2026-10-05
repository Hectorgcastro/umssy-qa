"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { accessRequestService } from "../services/access-request.service";
import type { AccessRequestContextValue, FormNotice, SubmitStatus } from "../types/access-request-context.types";
import type { FieldErrors, PersonalDataFieldName, PersonalDataValues } from "../types/access-request.types";
import { buildAccessRequestPayload } from "../utils/build-access-request-payload";
import { validatePersonalData } from "../utils/validate-personal-data";

const EMPTY_VALUES: PersonalDataValues = {
  firstName: "",
  lastName: "",
  idCardNumber: "",
  idCardIssuedIn: "",
  sisCode: "",
  email: "",
  phone: "",
  birthDate: "",
  graduationYear: "",
  career: "",
};

const AccessRequestContext = createContext<AccessRequestContextValue | null>(null);

// Estado del flujo solo en memoria: recargar la página pierde el borrador (no se guarda nada en el navegador)
export function AccessRequestProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<PersonalDataValues>(EMPTY_VALUES);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<FormNotice | null>(null);

  // Las refs evitan envíos duplicados y datos viejos cuando dos eventos llegan antes del siguiente render
  const valuesRef = useRef(values);
  const draftIdRef = useRef<string | null>(null);
  const submittingRef = useRef(false);

  const updateDraftId = useCallback((id: string | null) => {
    draftIdRef.current = id;
    setDraftId(id);
  }, []);

  const setValue = useCallback((field: PersonalDataFieldName, value: string) => {
    valuesRef.current = { ...valuesRef.current, [field]: value };
    setValues(valuesRef.current);
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const submit = useCallback(async () => {
    if (submittingRef.current) return;

    const errors = validatePersonalData(valuesRef.current);
    setNotice(null);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");
    setFieldErrors({});

    const currentDraftId = draftIdRef.current;
    const payload = buildAccessRequestPayload(valuesRef.current, currentDraftId ? "update" : "create");
    const result = currentDraftId
      ? await accessRequestService.updateAccessRequest(currentDraftId, payload)
      : await accessRequestService.createAccessRequest(payload);

    if (result.ok) {
      if (!currentDraftId) {
        updateDraftId(result.data.id ?? null);
      }
      // TODO: avanzar al paso 2 (documento de respaldo) cuando exista
      setNotice({ type: "success", text: "Tus datos se guardaron correctamente." });
    } else {
      // Si el borrador ya no existe, el siguiente envío crea uno nuevo
      if (result.status === 404) updateDraftId(null);
      setFieldErrors(result.fieldErrors);
      setNotice({ type: "error", text: result.message });
    }

    submittingRef.current = false;
    setStatus("idle");
  }, [updateDraftId]);

  const value = useMemo(
    () => ({ values, draftId, status, fieldErrors, notice, setValue, submit }),
    [values, draftId, status, fieldErrors, notice, setValue, submit],
  );

  return <AccessRequestContext.Provider value={value}>{children}</AccessRequestContext.Provider>;
}

export function useAccessRequestForm(): AccessRequestContextValue {
  const context = useContext(AccessRequestContext);
  if (!context) {
    throw new Error("useAccessRequestForm debe usarse dentro de AccessRequestProvider");
  }
  return context;
}
