import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/db";

export async function GET(request: NextRequest, context: any) {
  const { params } = context;
  const chatboxId = params.chatboxId;
  const record = (await getRecord(Number(chatboxId))) as [];

  if (record === null) {
    return NextResponse.json(
      {
        message: "Record not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      message: "Record fetched successfully",
      data: record,
    },
    {
      status: 200,
    }
  );
}

async function getRecord(id: number) {
  if (globalThis.prisma == null) {
    globalThis.prisma = new PrismaClient();
  }
  try {
    const record = await prisma.message.findMany({
      select: {
        request: true,
        response: true,
        chatBoxId: true,
        userId: true,
        createdAt: true,
        rating: true,
        liked: true,
        disliked: true,
        id: true,
      },
      where: {
        chatBoxId: id,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return record;
  } catch (err) {
    console.error("Error fetching record", err);
  }
}
