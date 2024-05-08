/*
  Warnings:

  - Added the required column `topic` to the `Doc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doc" ADD COLUMN     "topic" TEXT NOT NULL;
