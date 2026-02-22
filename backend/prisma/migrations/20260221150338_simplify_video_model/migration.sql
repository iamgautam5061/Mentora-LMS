/*
  Warnings:

  - You are about to drop the column `description` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `processedKey` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `rawKey` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Video` table. All the data in the column will be lost.
  - Added the required column `s3Key` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "description",
DROP COLUMN "processedKey",
DROP COLUMN "rawKey",
DROP COLUMN "status",
ADD COLUMN     "s3Key" TEXT NOT NULL;
