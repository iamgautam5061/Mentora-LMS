/*
  Warnings:

  - You are about to drop the column `uploadedBy` on the `Video` table. All the data in the column will be lost.
  - Added the required column `course` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `university` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_uploadedBy_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "uploadedBy",
ADD COLUMN     "course" TEXT NOT NULL,
ADD COLUMN     "semester" INTEGER NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "university" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
