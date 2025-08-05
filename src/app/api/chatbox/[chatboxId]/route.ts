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

    const allDocIds = messages
  .map(msg => msg.retrieved_docs) // Ambil array retrieved_docs dari tiap pesan
  .filter(Array.isArray)          // Pastiin itu array
  .flatMap(docs => docs.map(doc => doc.document_id)) // Ambil `document_id` dari tiap objek
  .filter(Boolean) as string[];   // Buang yg null/undefined

// Ubah dari string ke angka dan ambil yang unik
const uniqueDocIds = [...new Set(allDocIds.map(id => parseInt(id)))];

// 2. Panggil 'penerjemah' buat dapet detailnya
const docDetails = await getDocumentsByIds(uniqueDocIds);
const docsMap = new Map(docDetails.map(doc => [doc.id, doc]));

// 3. "Suntik" detailnya balik ke data chat
const enrichedMessages = messages.map(msg => {
      // Cek kalo retrieved_docs ada dan merupakan array
      if (msg.retrieved_docs && Array.isArray(msg.retrieved_docs)) {
        
        const seen = new Map();
        // Lakukan de-duplikasi berdasarkan `document_id`
        (msg.retrieved_docs as any[]).forEach(doc => {
          if (doc && doc.document_id) {
            seen.set(doc.document_id, doc);
          }
        });
        const uniqueDocs = Array.from(seen.values());
        
        // Balikin pesan dengan properti `sourceDocs` yang udah unik
        return { ...msg, sourceDocs: uniqueDocs };
      }

      // Kalo gak ada, balikin pesan apa adanya dengan sourceDocs kosong
      return { ...msg, sourceDocs: [] };
    });
  // console.log("Enriched messages with document details:", enrichedMessages);
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
