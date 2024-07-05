import { PrismaClient } from "@prisma/client";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "File uploaded successfully" });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const requestChat = formData.get("request");
  const userId = formData.get("userId");
  const chatBoxId = formData.get("chatBoxId");
  const response = formData.get("response");
  const responseTime = formData.get("responseTime");

  if (!requestChat || !userId || !chatBoxId) {
    return NextResponse.json(
      { message: "Please fill in all fields" },
      { status: 400 }
    );
  }
  // const response = await getRecordLLM(requestChat as string) as string[];

  const id = await createRecord(
    requestChat as string,
    response as string,
    userId.toString(),
    Number(chatBoxId),
    Number(responseTime)
  );

  return NextResponse.json(
    {
      message: "Message has been successfully saved",
      id: id,
    },
    {
      status: 200,
    }
  );
}

export async function PUT(request: NextRequest) {
  const formData = await request.formData();
  const id = formData.get("id");
  const liked = formData.get("liked");
  const disliked = formData.get("disliked");
  const rating = formData.get("rating");

  updateRecord(Number(id), liked, disliked, rating);
  return NextResponse.json({ message: "File uploaded successfully" });
}

async function createRecord(
  request: string,
  response: string,
  userId: string,
  chatBoxId: number,
  responseTime: number
) {
  if (globalThis.prisma == null) {
    globalThis.prisma = new PrismaClient();
  }

  try {
    const message = await prisma.message.create({
      data: {
        request,
        response,
        userId,
        chatBoxId,
        createdAt: new Date(),
        response_time: responseTime,
      },
    });
    return message.id;
  } catch (err) {
    console.error("Error creating record", err);
  }
}

async function getRecordLLM(questions: string): Promise<unknown> {
  const { getToken } = auth();
  const token = await getToken();

  try {
    const response = await fetch(
      "http://140.118.101.189:5000/answer_questions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questions: [questions] }),
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching record", err);
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

async function updateRecord(
  id: number,
  liked: FormDataEntryValue | null,
  disliked: FormDataEntryValue | null,
  rating: FormDataEntryValue | null
) {
  if (globalThis.prisma == null) {
    globalThis.prisma = new PrismaClient();
  }
  const liked_bool = liked === "true";
  const disliked_bool = disliked === "true";
  const rating_int = Number(rating);
  try {
    await prisma.message.update({
      where: { id },
      data: {
        liked: liked_bool,
        disliked: disliked_bool,
        rating: rating_int,
      },
    });
  } catch (err) {
    console.error("Error updating record", err);
    return NextResponse.json(
      {
        message: "Error updating record",
      },
      {
        status: 500,
      }
    );
  }
}
