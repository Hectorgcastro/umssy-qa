CREATE TABLE IF NOT EXISTS "vacancies" (
  "id" UUID NOT NULL,
  "title" VARCHAR(150) NOT NULL,
  "company_name" VARCHAR(150) NOT NULL,
  "description" TEXT NOT NULL,
  "location" TEXT,
  "modality" TEXT,
  "required_skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "academic_requirements" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "other_requirements" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "expires_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "vacancies_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "vacancies" ADD COLUMN IF NOT EXISTS "min_experience_years" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "vacancies" ADD CONSTRAINT "vacancies_experience_nonnegative" CHECK ("min_experience_years" >= 0);
CREATE INDEX IF NOT EXISTS "vacancies_is_active_created_at_idx" ON "vacancies"("is_active", "created_at");
