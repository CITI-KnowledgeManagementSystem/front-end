import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  context: { params: { messageId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { params } = context;
    const awaitedParams = await params;
    const messageId = parseInt(awaitedParams.messageId);

    const message = await prisma.message.findUnique({
      where: { id: messageId, userId: userId },
      select: { faithfulness: true }, // Kita cuma butuh satu kolom skor buat ngecek
    });

    if (!message) {
      return NextResponse.json({ status: "not_found" }, { status: 404 });
    }

    // Kalo kolom faithfulness udah gak null, berarti evaluasi selesai
    if (message.faithfulness !== null) {
      return NextResponse.json({ status: "complete" });
    } else {
      return NextResponse.json({ status: "pending" });
    }
  } catch (error) {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}