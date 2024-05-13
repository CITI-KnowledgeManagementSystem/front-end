/*
  Warnings:

  - Added the required column `file_size` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "file_size" INTEGER NOT NULL;
