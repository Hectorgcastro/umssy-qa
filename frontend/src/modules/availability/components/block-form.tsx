"use client";

import { useState } from "react";
import { es } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toBoliviaTime, toUtcIso } from "@/shared/utils/date-time";
import {
  BLOCK_MAX_HOUR,
  BLOCK_MIN_HOUR,
  BLOCK_STEP_MINUTES,
  validateBlock,
} from "../utils/block-validation";
import type { CreateAvailabilityBlockInput } from "../types/availability";

export type BlockFormMode = "create" | "edit";

type BlockFormField = "date" | "startAt" | "endAt";
type BlockFormErrors = Partial<Record<BlockFormField, string>>;

interface BlockFormProps {
  mode: BlockFormMode;
  initialValues?: Partial<CreateAvailabilityBlockInput>;
  isSubmitting?: boolean;
  submitError?: string | null;
  onSubmit: (values: CreateAvailabilityBlockInput) => void;
  onCancel: () => void;
}

const FORM_TEXT: Record<BlockFormMode, { title: string; description: string; submit: string }> = {
  create: {
    title: "Nuevo bloque de disponibilidad",
    description: "Indica el día y el horario en que puedes atender sesiones de mentoría.",
    submit: "Guardar bloque",
  },
  edit: {
    title: "Editar bloque",
    description: "Modifica el día o el horario del bloque.",
    submit: "Guardar cambios",
  },
};

const REQUIRED_MESSAGES: Record<BlockFormField, string> = {
  date: "Selecciona un día",
  startAt: "Selecciona la hora de inicio",
  endAt: "Selecciona la hora de fin",
};

const pad = (value: number): string => String(value).padStart(2, "0");

const TIME_OPTIONS: string[] = Array.from(
  { length: ((BLOCK_MAX_HOUR - BLOCK_MIN_HOUR) * 60) / BLOCK_STEP_MINUTES + 1 },
  (_, index) => {
    const minutes = BLOCK_MIN_HOUR * 60 + index * BLOCK_STEP_MINUTES;
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  },
);

const SELECT_CLASS_NAME =
  "h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm";

// El calendario trabaja con fechas locales; se usan solo como día de calendario (YYYY-MM-DD).
const toCalendarDate = (date: string): Date => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const toDateString = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const getBoliviaToday = (): Date => toCalendarDate(toBoliviaTime(new Date()).date);

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-destructive">
      {" *"}
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function BlockForm({
  mode,
  initialValues,
  isSubmitting = false,
  submitError,
  onSubmit,
  onCancel,
}: BlockFormProps) {
  const [today] = useState(getBoliviaToday);
  const [date, setDate] = useState(() =>
    initialValues?.startAt ? toBoliviaTime(initialValues.startAt).date : "",
  );
  const [startTime, setStartTime] = useState(() =>
    initialValues?.startAt ? toBoliviaTime(initialValues.startAt).time : "",
  );
  const [endTime, setEndTime] = useState(() =>
    initialValues?.endAt ? toBoliviaTime(initialValues.endAt).time : "",
  );
  const [errors, setErrors] = useState<BlockFormErrors>({});

  const text = FORM_TEXT[mode];
  const selectedDate = date ? toCalendarDate(date) : undefined;

  const clearErrors = (...fields: BlockFormField[]) => {
    setErrors((prev) => {
      const next = { ...prev };
      fields.forEach((field) => delete next[field]);
      return next;
    });
  };

  const handleDateSelect = (day?: Date) => {
    setDate(day ? toDateString(day) : "");
    clearErrors("date", "startAt");
  };

  const handleStartChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTime(event.target.value);
    clearErrors("startAt", "endAt");
  };

  const handleEndChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTime(event.target.value);
    clearErrors("endAt");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const missing: BlockFormErrors = {};
    if (!date) missing.date = REQUIRED_MESSAGES.date;
    if (!startTime) missing.startAt = REQUIRED_MESSAGES.startAt;
    if (!endTime) missing.endAt = REQUIRED_MESSAGES.endAt;
    if (Object.keys(missing).length > 0) {
      setErrors(missing);
      return;
    }

    const values: CreateAvailabilityBlockInput = {
      startAt: toUtcIso(date, startTime),
      endAt: toUtcIso(date, endTime),
    };

    const validationErrors = validateBlock(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-5 rounded-xl border bg-card p-4 text-card-foreground sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-lg font-semibold">{text.title}</h2>
        <p className="text-sm text-muted-foreground">{text.description}</p>
      </div>

      <fieldset className="flex flex-col gap-2" aria-describedby={errors.date ? "date-error" : undefined}>
        <legend className="mb-2 text-sm font-medium">
          Día
          <RequiredMark />
        </legend>
        <Calendar
          mode="single"
          locale={es}
          selected={selectedDate}
          onSelect={handleDateSelect}
          defaultMonth={selectedDate ?? today}
          disabled={{ before: today }}
          className="w-full rounded-lg border sm:w-fit"
        />
        <FieldError id="date-error" message={errors.date} />
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="startAt" className="text-sm font-medium">
            Hora de inicio
            <RequiredMark />
          </label>
          <select
            id="startAt"
            name="startAt"
            value={startTime}
            onChange={handleStartChange}
            aria-invalid={errors.startAt ? true : undefined}
            aria-describedby={errors.startAt ? "startAt-error" : undefined}
            className={SELECT_CLASS_NAME}
          >
            <option value="">--:--</option>
            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <FieldError id="startAt-error" message={errors.startAt} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="endAt" className="text-sm font-medium">
            Hora de fin
            <RequiredMark />
          </label>
          <select
            id="endAt"
            name="endAt"
            value={endTime}
            onChange={handleEndChange}
            aria-invalid={errors.endAt ? true : undefined}
            aria-describedby={errors.endAt ? "endAt-error" : undefined}
            className={SELECT_CLASS_NAME}
          >
            <option value="">--:--</option>
            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <FieldError id="endAt-error" message={errors.endAt} />
        </div>
      </div>

      {submitError && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {submitError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : text.submit}
        </Button>
      </div>
    </form>
  );
}
