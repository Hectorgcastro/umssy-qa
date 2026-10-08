-- AlterTable
ALTER TABLE "users" ADD COLUMN     "document_type" VARCHAR(50),
ADD COLUMN     "identifier" VARCHAR(50),
ADD COLUMN     "registration_status" VARCHAR(30) DEFAULT 'APPROVED',
ADD COLUMN     "rejection_reason" VARCHAR(300);
