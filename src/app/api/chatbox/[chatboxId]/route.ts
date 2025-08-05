import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/db";
import { getDocumentsByIds } from "@/lib/document-queries";
import { DocumentProps } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { chatboxId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const awaitedparams = await params
    const chatboxId = awaitedparams.chatboxId;
    console.log("Fetching messages for chatbox ID:", chatboxId);

    if (!chatboxId) {
      return NextResponse.json(
        { message: "Please provide a chatbox ID" },
        { status: 400 }
      );
    }

    // Verify the chatbox belongs to the user
    const chatbox = await prisma.chatBox.findFirst({
      where: {
        id: parseInt(chatboxId),
        userId: userId,
        deletedAt: null,
      },
    });

    if (!chatbox) {
      return NextResponse.json(
        { message: "Chatbox not found" },
        { status: 404 }
      );
    }

    // Fetch messages for this chatbox
    const messages = await prisma.message.findMany({
      where: {
        chatBoxId: parseInt(chatboxId),
      },
      orderBy: {
        createdAt: "asc",
      },
    });

     const docIdsAsStrings = messages
      .map(msg => msg.retrieved_docs) // Ambil array retrieved_docs dari tiap pesan
      .filter(Array.isArray)          // Pastiin itu array
      .flat() as string[];            // Gabungin semua array jadi satu

    // Ubah dari string ke angka dan ambil yang unik
    const uniqueDocIds = [...new Set(docIdsAsStrings.map(id => parseInt(id)))];
    
    // 3. Panggil 'penerjemah' buat dapet detailnya
    const docDetails = await getDocumentsByIds(uniqueDocIds);
    const docsMap = new Map(docDetails.map(doc => [doc.id, doc]));

    // 4. 'Suntik' detailnya balik ke data chat
    const enrichedMessages = messages.map(msg => {
      // Cek apakah pesan ini punya retrieved_docs
      if (msg.retrieved_docs && Array.isArray(msg.retrieved_docs)) {
        const uniqueIdsForThisMessage = [...new Set(msg.retrieved_docs as string[])];
        return {
          ...msg,
          // Bikin properti baru 'sourceDocs' yang isinya objek dokumen lengkap
          sourceDocs: uniqueIdsForThisMessage
            .map(id => docsMap.get(parseInt(id)))
            .filter(Boolean) as DocumentProps[]
        };
      }
      return msg;
    });

    return NextResponse.json(
      {
        message: "Messages fetched successfully",
        data: enrichedMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching chatbox messages :", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
