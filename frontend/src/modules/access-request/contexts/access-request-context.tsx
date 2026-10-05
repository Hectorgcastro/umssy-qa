"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { accessRequestService } from "../services/access-request.service";
import type {
  AccessRequestContextValue,
  ClearResult,
  FormNotice,
  SubmitStatus,
} from "../types/access-request-context.types";
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

const BUSY_MESSAGE = "Hay una operación en curso. Espera a que termine.";

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
  const clearingRef = useRef(false);

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

  // Cualquier campo con valor (sin contar espacios) cuenta como dato; el draftId no influye
  const hasData = useMemo(() => Object.values(values).some((value) => value.trim() !== ""), [values]);

  const submit = useCallback(async () => {
    if (submittingRef.current || clearingRef.current) return;

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

  // Vacía el formulario y elimina el borrador del servidor si existe. Si el DELETE falla (salvo 404) no se limpia nada
  const clear = useCallback(async (): Promise<ClearResult> => {
    if (submittingRef.current || clearingRef.current) return { ok: false, message: BUSY_MESSAGE };

    clearingRef.current = true;
    setStatus("clearing");

    const currentDraftId = draftIdRef.current;
    if (currentDraftId) {
      const result = await accessRequestService.deleteAccessRequest(currentDraftId);
      // Un 404 cuenta como éxito: el borrador ya no existe
      if (!result.ok && result.status !== 404) {
        clearingRef.current = false;
        setStatus("idle");
        return { ok: false, message: result.message };
      }
    }

    valuesRef.current = EMPTY_VALUES;
    setValues(EMPTY_VALUES);
    setFieldErrors({});
    setNotice(null);
    updateDraftId(null);

    clearingRef.current = false;
    setStatus("idle");
    return { ok: true };
  }, [updateDraftId]);

  const value = useMemo(
    () => ({ values, draftId, status, fieldErrors, notice, hasData, setValue, submit, clear }),
    [values, draftId, status, fieldErrors, notice, hasData, setValue, submit, clear],
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
