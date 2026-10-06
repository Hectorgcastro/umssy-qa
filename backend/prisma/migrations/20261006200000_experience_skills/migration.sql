ALTER TABLE "work_experiences" ADD COLUMN "detected_skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
