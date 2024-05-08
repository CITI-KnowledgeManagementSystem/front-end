/*
  Warnings:

  - You are about to drop the `Doc` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Doc" DROP CONSTRAINT "Doc_userId_fkey";

-- DropForeignKey
ALTER TABLE "vdb" DROP CONSTRAINT "vdb_docId_fkey";

-- DropTable
DROP TABLE "Doc";

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "displayed_name" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vdb" ADD CONSTRAINT "vdb_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
