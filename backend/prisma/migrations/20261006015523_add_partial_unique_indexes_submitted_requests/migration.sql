-- Unicidad de correo, C.I. y código SIS solo entre solicitudes enviadas.
-- Los borradores (submitted_at NULL) quedan fuera de los índices.
-- Una solicitud rechazada sigue ocupando estos datos hasta definir el reenvío.
CREATE UNIQUE INDEX "uq_access_requests_email_submitted" ON "access_requests" (lower("email")) WHERE "submitted_at" IS NOT NULL;

CREATE UNIQUE INDEX "uq_access_requests_id_card_submitted" ON "access_requests" ("id_card_number") WHERE "submitted_at" IS NOT NULL;

CREATE UNIQUE INDEX "uq_access_requests_sis_code_submitted" ON "access_requests" ("sis_code") WHERE "submitted_at" IS NOT NULL;
