import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/db';

export async function GET(request: NextRequest, context: any) {
    const { params } = context;
    const chatboxId = params.chatboxId;
    console.log(chatboxId);
    const record = await getRecord(Number(chatboxId));
    return NextResponse.json(
        {
            message: 'Record fetched successfully',
            data: record,
        },
        {
            status: 200,
        }
    )
}

async function getRecord(id: number) {
    if (globalThis.prisma == null) {
        globalThis.prisma = new PrismaClient();
    }
    try {
        const record = await prisma.message.findMany({
            where: {
                chatBoxId: id,
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return record;
    } catch (err) {
        console.error('Error fetching record', err);
    }
}
