import { PrismaClient } from "@prisma/client";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";

export async function GET(request: NextRequest) {
    return NextResponse.json(
        { message: 'File uploaded successfully' }
    )
}

export async function POST(request: NextRequest) {

    const formData = await request.formData();
    const request_chat = formData.get("request");
    const userId = formData.get("userId");
    const chatBoxId = formData.get("chatBoxId");
    const response = formData.get("response");

    if (!request_chat || !userId || !chatBoxId) {
        return NextResponse.json(
            { message: 'Please fill in all fields' },
            { status: 400 }
        )
    }

    // const response = await getRecordLLM(request_chat as string) as string[];

    createRecord(request_chat as string, response as string, userId.toString(), Number(chatBoxId));

    return NextResponse.json(
        {
            message: 'Message has been successfully saved',
        },
        {
            status: 200
        }
    )
}

async function createRecord(request: string, response: string, userId: string, chatBoxId: number) {
    if (globalThis.prisma == null) {
        globalThis.prisma = new PrismaClient();
    }
    
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
    }
}

async function getRecordLLM(questions: string): Promise<unknown> {
    try {
        const response = await fetch('http://140.118.101.189:5000/answer_questions', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ questions: [questions] })
        });
        const data = await response.json();
        return data;

    } catch (err) {
        console.error('Error fetching record', err);
        return NextResponse.json(
            {
                message: 'Error fetching record',
            },
            {
                status: 500
            }
        )
    }
}