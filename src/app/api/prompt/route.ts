import { PrismaClient } from "@prisma/client";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { useSession } from "@clerk/nextjs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const question = formData.get("question");
  const conversation_history = formData.get("history");
  const hyde = formData.get("hyde");
  const reranking = formData.get("reranking");
  const { userId, sessionId } = auth();

  const body = {
    user_id: userId,
    question: question,
    conversation_history: conversation_history,
    hyde: hyde,
    reranking: reranking,
  };

  console.log(body);

  try {
    const { getToken } = auth();
    const token = await getToken();
    const response = await fetch(
      process.env.NEXT_PUBLIC_LLM_SERVER_URL + "/llm/chat_with_llm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json({ message: data.payload }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error fetching record",
      },
      {
        status: 500,
      }
    );
  }
}
