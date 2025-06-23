import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/db";

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

    return NextResponse.json(
      {
        message: "Messages fetched successfully",
        data: messages,
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
