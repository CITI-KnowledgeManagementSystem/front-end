-- DropForeignKey
ALTER TABLE "ChatBox" DROP CONSTRAINT "ChatBox_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatBoxId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "vdb" DROP CONSTRAINT "vdb_docId_fkey";

-- AlterTable
ALTER TABLE "ChatBox" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "chatBoxId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vdb" ALTER COLUMN "docId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "vdb" ADD CONSTRAINT "vdb_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatBox" ADD CONSTRAINT "ChatBox_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatBoxId_fkey" FOREIGN KEY ("chatBoxId") REFERENCES "ChatBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
