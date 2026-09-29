/*
  Warnings:

  - You are about to drop the column `status` on the `appointments` table. All the data in the column will be lost.
  - The `orientation_type_id` column on the `appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `document_url` column on the `certifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `event_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `event_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `modality` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `events` table. All the data in the column will be lost.
  - The primary key for the `mentor_orientation_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mentor_technical_areas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `orientation_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `technical_areas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `time_proposals` table. All the data in the column will be lost.
  - The primary key for the `user_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `end_at` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `users` table. All the data in the column will be lost.
  - The `photo_url` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cv_pdf_url` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `company` on the `work_experiences` table. All the data in the column will be lost.
  - You are about to drop the `appointment_history` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mentor_id,orientation_type_id]` on the table `mentor_orientation_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mentor_id,technical_area_id]` on the table `mentor_technical_areas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,role_id,start_at]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status_id` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `blocked_dates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `event_attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `event_categories` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `event_categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status_id` to the `event_registrations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `event_registrations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modality_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category_id` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `mentor_orientation_types` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updated_at` to the `mentor_orientation_types` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `orientation_type_id` on the `mentor_orientation_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `mentor_technical_areas` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updated_at` to the `mentor_technical_areas` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `technical_area_id` on the `mentor_technical_areas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updated_at` to the `orientation_types` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `orientation_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updated_at` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `technical_areas` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `technical_areas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status_id` to the `time_proposals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `time_proposals` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `user_roles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updated_at` to the `user_roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `work_experiences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointment_history" DROP CONSTRAINT "appointment_history_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "appointment_history" DROP CONSTRAINT "appointment_history_changed_by_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_orientation_type_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_category_id_fkey";

-- DropForeignKey
ALTER TABLE "mentor_orientation_types" DROP CONSTRAINT "mentor_orientation_types_orientation_type_id_fkey";

-- DropForeignKey
ALTER TABLE "mentor_technical_areas" DROP CONSTRAINT "mentor_technical_areas_technical_area_id_fkey";

-- DropIndex
DROP INDEX "appointments_status_idx";

-- DropIndex
DROP INDEX "events_status_idx";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "status",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status_id" UUID NOT NULL,
DROP COLUMN "orientation_type_id",
ADD COLUMN     "orientation_type_id" UUID;

-- AlterTable
ALTER TABLE "blocked_dates" ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;

-- AlterTable
ALTER TABLE "certifications" DROP COLUMN "document_url",
ADD COLUMN     "document_url" BYTEA;

-- AlterTable
ALTER TABLE "event_attendances" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;

-- AlterTable
ALTER TABLE "event_categories" DROP CONSTRAINT "event_categories_pkey",
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "event_categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "event_registrations" DROP COLUMN "status",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "modality",
DROP COLUMN "origin",
DROP COLUMN "status",
ADD COLUMN     "modality_id" UUID NOT NULL,
ADD COLUMN     "origin_id" UUID NOT NULL,
ADD COLUMN     "status_id" UUID NOT NULL,
DROP COLUMN "category_id",
ADD COLUMN     "category_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "mentor_orientation_types" DROP CONSTRAINT "mentor_orientation_types_pkey",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "orientation_type_id",
ADD COLUMN     "orientation_type_id" UUID NOT NULL,
ADD CONSTRAINT "mentor_orientation_types_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mentor_technical_areas" DROP CONSTRAINT "mentor_technical_areas_pkey",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "technical_area_id",
ADD COLUMN     "technical_area_id" UUID NOT NULL,
ADD CONSTRAINT "mentor_technical_areas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "orientation_types" DROP CONSTRAINT "orientation_types_pkey",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "orientation_types_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;

-- AlterTable
ALTER TABLE "technical_areas" DROP CONSTRAINT "technical_areas_pkey",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "technical_areas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "time_proposals" DROP COLUMN "status",
ADD COLUMN     "status_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;

-- AlterTable
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_pkey",
DROP COLUMN "end_at",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "city",
ADD COLUMN     "city_id" UUID,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "photo_url",
ADD COLUMN     "photo_url" BYTEA,
DROP COLUMN "cv_pdf_url",
ADD COLUMN     "cv_pdf_url" BYTEA;

-- AlterTable
ALTER TABLE "work_experiences" DROP COLUMN "company",
ADD COLUMN     "company_id" UUID NOT NULL;

-- DropTable
DROP TABLE "appointment_history";

-- DropEnum
DROP TYPE "appointment_status";

-- DropEnum
DROP TYPE "event_modality";

-- DropEnum
DROP TYPE "event_origin";

-- DropEnum
DROP TYPE "event_status";

-- DropEnum
DROP TYPE "proposal_status";

-- DropEnum
DROP TYPE "registration_status";

-- CreateTable
CREATE TABLE "appointment_statuses" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "appointment_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_statuses" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "proposal_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_modalities" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "event_modalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_origins" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "event_origins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_statuses" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "event_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_statuses" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "registration_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_histories" (
    "id" UUID NOT NULL,
    "appointment_id" UUID NOT NULL,
    "previous_status_id" UUID,
    "new_status_id" UUID NOT NULL,
    "changed_by" UUID,
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" VARCHAR(300),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "appointment_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appointment_statuses_title_key" ON "appointment_statuses"("title");

-- CreateIndex
CREATE UNIQUE INDEX "proposal_statuses_title_key" ON "proposal_statuses"("title");

-- CreateIndex
CREATE UNIQUE INDEX "event_modalities_title_key" ON "event_modalities"("title");

-- CreateIndex
CREATE UNIQUE INDEX "event_origins_title_key" ON "event_origins"("title");

-- CreateIndex
CREATE UNIQUE INDEX "event_statuses_title_key" ON "event_statuses"("title");

-- CreateIndex
CREATE UNIQUE INDEX "registration_statuses_title_key" ON "registration_statuses"("title");

-- CreateIndex
CREATE UNIQUE INDEX "cities_title_key" ON "cities"("title");

-- CreateIndex
CREATE UNIQUE INDEX "companies_title_key" ON "companies"("title");

-- CreateIndex
CREATE INDEX "appointment_histories_appointment_id_changed_at_idx" ON "appointment_histories"("appointment_id", "changed_at");

-- CreateIndex
CREATE INDEX "appointment_histories_previous_status_id_idx" ON "appointment_histories"("previous_status_id");

-- CreateIndex
CREATE INDEX "appointment_histories_new_status_id_idx" ON "appointment_histories"("new_status_id");

-- CreateIndex
CREATE INDEX "appointments_status_id_idx" ON "appointments"("status_id");

-- CreateIndex
CREATE INDEX "event_registrations_status_id_idx" ON "event_registrations"("status_id");

-- CreateIndex
CREATE INDEX "events_category_id_idx" ON "events"("category_id");

-- CreateIndex
CREATE INDEX "events_modality_id_idx" ON "events"("modality_id");

-- CreateIndex
CREATE INDEX "events_origin_id_idx" ON "events"("origin_id");

-- CreateIndex
CREATE INDEX "events_status_id_idx" ON "events"("status_id");

-- CreateIndex
CREATE INDEX "mentor_orientation_types_orientation_type_id_idx" ON "mentor_orientation_types"("orientation_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_orientation_types_mentor_id_orientation_type_id_key" ON "mentor_orientation_types"("mentor_id", "orientation_type_id");

-- CreateIndex
CREATE INDEX "mentor_technical_areas_technical_area_id_idx" ON "mentor_technical_areas"("technical_area_id");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_technical_areas_mentor_id_technical_area_id_key" ON "mentor_technical_areas"("mentor_id", "technical_area_id");

-- CreateIndex
CREATE INDEX "time_proposals_status_id_idx" ON "time_proposals"("status_id");

-- CreateIndex
CREATE INDEX "user_roles_user_id_idx" ON "user_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_start_at_key" ON "user_roles"("user_id", "role_id", "start_at");

-- CreateIndex
CREATE INDEX "users_city_id_idx" ON "users"("city_id");

-- CreateIndex
CREATE INDEX "work_experiences_company_id_idx" ON "work_experiences"("company_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_technical_areas" ADD CONSTRAINT "mentor_technical_areas_technical_area_id_fkey" FOREIGN KEY ("technical_area_id") REFERENCES "technical_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_orientation_types" ADD CONSTRAINT "mentor_orientation_types_orientation_type_id_fkey" FOREIGN KEY ("orientation_type_id") REFERENCES "orientation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "appointment_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_orientation_type_id_fkey" FOREIGN KEY ("orientation_type_id") REFERENCES "orientation_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_proposals" ADD CONSTRAINT "time_proposals_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "proposal_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_histories" ADD CONSTRAINT "appointment_histories_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_histories" ADD CONSTRAINT "appointment_histories_previous_status_id_fkey" FOREIGN KEY ("previous_status_id") REFERENCES "appointment_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_histories" ADD CONSTRAINT "appointment_histories_new_status_id_fkey" FOREIGN KEY ("new_status_id") REFERENCES "appointment_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_histories" ADD CONSTRAINT "appointment_histories_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "event_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_modality_id_fkey" FOREIGN KEY ("modality_id") REFERENCES "event_modalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "event_origins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "event_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "registration_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
