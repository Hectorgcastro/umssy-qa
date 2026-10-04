"use client";

import { useState } from "react";
import { CalendarDaysIcon, CircleAlertIcon } from "lucide-react";
import { es } from "react-day-picker/locale";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { toBoliviaTime, toUtcIso } from "@/shared/utils/date-time";
import { FORM_TEXT, REQUIRED_MESSAGES, TIME_OPTIONS } from "../constants/availability.constants";
import type { BlockFormErrors } from "../types/block-form-errors.types";
import type { BlockFormField } from "../types/block-form-field.types";
import type { BlockFormProps } from "../types/block-form-props.types";
import type { CreateAvailabilityBlockInput } from "../types/create-availability-block-input.types";
import { validateBlock } from "../utils/block-validation";
import { formatLongDate, getBoliviaToday, toCalendarDate, toDateString } from "../utils/calendar-date";

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-destructive">
      *
    </span>
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
    <Card className="w-full [--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(6)]">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{text.title}</CardTitle>
        <CardDescription>{text.description}</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate className="contents">
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Field data-invalid={errors.date ? true : undefined}>
              <FieldLabel htmlFor="date" className="font-semibold">
                Fecha
                <RequiredMark />
              </FieldLabel>
              <div className="relative">
                <Input
                  id="date"
                  readOnly
                  value={date ? formatLongDate(date) : ""}
                  placeholder="Selecciona una fecha en el calendario"
                  aria-invalid={errors.date ? true : undefined}
                  aria-describedby={errors.date ? "date-error" : "date-hint"}
                  className="h-10 pr-10"
                />
                <CalendarDaysIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
              </div>
              <Calendar
                mode="single"
                locale={es}
                selected={selectedDate}
                onSelect={handleDateSelect}
                defaultMonth={selectedDate ?? today}
                disabled={{ before: today }}
                className="w-full rounded-lg border [--cell-size:--spacing(9)]"
              />
              <FieldDescription id="date-hint" className="text-xs">
                Los días anteriores a hoy no se pueden elegir.
              </FieldDescription>
              {errors.date && <FieldError id="date-error">{errors.date}</FieldError>}
            </Field>

            <FieldGroup className="gap-4">
              <Field data-invalid={errors.startAt ? true : undefined}>
                <FieldLabel htmlFor="startAt" className="font-semibold">
                  Hora de inicio
                  <RequiredMark />
                </FieldLabel>
                <NativeSelect
                  id="startAt"
                  name="startAt"
                  value={startTime}
                  onChange={handleStartChange}
                  aria-invalid={errors.startAt ? true : undefined}
                  aria-describedby={errors.startAt ? "startAt-error" : undefined}
                  className="w-full [&>select]:h-10"
                >
                  <NativeSelectOption value="">--:--</NativeSelectOption>
                  {TIME_OPTIONS.map((time) => (
                    <NativeSelectOption key={time} value={time}>
                      {time}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {errors.startAt && <FieldError id="startAt-error">{errors.startAt}</FieldError>}
              </Field>

              <Field data-invalid={errors.endAt ? true : undefined}>
                <FieldLabel htmlFor="endAt" className="font-semibold">
                  Hora de fin
                  <RequiredMark />
                </FieldLabel>
                <NativeSelect
                  id="endAt"
                  name="endAt"
                  value={endTime}
                  onChange={handleEndChange}
                  aria-invalid={errors.endAt ? true : undefined}
                  aria-describedby={errors.endAt ? "endAt-error" : undefined}
                  className="w-full [&>select]:h-10"
                >
                  <NativeSelectOption value="">--:--</NativeSelectOption>
                  {TIME_OPTIONS.map((time) => (
                    <NativeSelectOption key={time} value={time}>
                      {time}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {errors.endAt && <FieldError id="endAt-error">{errors.endAt}</FieldError>}
              </Field>

              <FieldDescription className="text-xs">
                La hora de fin debe ser posterior a la de inicio. Horario en hora de Bolivia (GMT-4).
              </FieldDescription>
            </FieldGroup>
          </div>

          {submitError && (
            <Alert variant="destructive">
              <CircleAlertIcon aria-hidden="true" />
              <AlertTitle>{submitError}</AlertTitle>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex-col-reverse gap-2 bg-transparent sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : text.submit}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
