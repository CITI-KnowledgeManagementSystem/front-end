import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  // 1. Proteksi endpoint
  const internalSecret = request.headers.get("x-internal-secret");
  if (internalSecret !== process.env.INTERNAL_SECRET_KEY) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const messageId = parseInt(params.messageId);
    if (isNaN(messageId)) {
      return NextResponse.json({ message: "Invalid Message ID" }, { status: 400 });
    }

    // 2. Ambil data skor dari body
    const scores = await request.json();

    // 3. Update ke database Prisma
    await prisma.message.update({
      where: { id: messageId },
      data: {
        faithfulness: scores.faithfulness,
        answer_relevancy: scores.answer_relevancy,
        context_precision: scores.context_precision,
        context_relevance: scores.context_relevance,
      },
    });

    return NextResponse.json({ success: true, message: "Scores updated." });

  } catch (error) {
    console.error("Gagal update skor:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}