/*
  Warnings:

  - You are about to drop the column `course` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `university` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Video` table. All the data in the column will be lost.
  - Added the required column `subjectId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "course",
DROP COLUMN "semester",
DROP COLUMN "subject",
DROP COLUMN "university",
DROP COLUMN "year",
ADD COLUMN     "subjectId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "University_name_key" ON "University"("name");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
