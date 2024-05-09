import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    console.log(request);
    return NextResponse.json(
        { message: 'File uploaded successfully' }
    )
}

export async function POST(request: NextRequest) {
    console.log(request);
    const formData = await request.formData();
    const request_chat = formData.get("request");
    const response = formData.get("response");
    const userId = formData.get("userId");
    const chatBoxId = formData.get("chatBoxId");

    if (!request_chat || !response || !userId || !chatBoxId) {
        return NextResponse.json(
            { message: 'Please fill in all fields' },
            { status: 400 }
        )
    }

    createRecord(request_chat as string, response as string, Number(userId), Number(chatBoxId));
    
    return NextResponse.json(
        { message: 'File uploaded successfully' }
    )
}

async function createRecord(request: string, response: string, userId: number, chatBoxId: number) {
    const prisma = await new PrismaClient();
    try {
        await prisma.message.create({
            data: {
                request,
                response,
                userId,
                chatBoxId,
                createdAt: new Date(),
            }
        });
    } catch (err) {
        console.error('Error creating record', err);
    } finally {
        await prisma.$disconnect();
    }
}