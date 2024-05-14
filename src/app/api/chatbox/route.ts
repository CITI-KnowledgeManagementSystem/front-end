import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";


export async function GET(request: NextRequest) {
    const user_id = request.nextUrl.searchParams.get("user_id");
    if (!user_id) {
        return NextResponse.json(
            { message: 'Please provide an user_id' },
            { status: 400 }
        )
    }
    const record = await getRecord(user_id.toString());
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

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const userId = formData.get("userId");
    const name = formData.get("name");

    if (!userId || !name) {
        return NextResponse.json(
            { message: 'Please fill in all fields' },
            { status: 400 }
        )
    }

    createRecord(userId.toString(), name as string);
    return NextResponse.json(
        {
            message: 'Record created successfully',
        },
        {
            status: 200
        }
    )
}

export async function PUT(request: NextRequest) {
    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name");

    if (!id || !name) {
        return NextResponse.json(
            { message: 'Please fill in all fields' },
            { status: 400 }
        )
    }

    updateRecord(Number(id), name as string);
    return NextResponse.json(
        {
            message: 'Record updated successfully',
        },
        {
            status: 200
        }
    )
}

export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
        return NextResponse.json(
            { message: 'Please provide an id' },
            { status: 400 }
        )
    }
    deleteRecord(Number(id));
    return NextResponse.json(
        {
            message: 'Record deleted successfully',
        },
        {
            status: 200
        }
    )
}

async function getRecord(id: string) {
    if (globalThis.prisma == null) {
        globalThis.prisma = new PrismaClient();
    }

    try {
        const record = await prisma.chatBox.findMany({
            where: {
                userId: id
            }
        });
        return record;
    } catch (error) {
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

async function createRecord(userId: string, name: string) {
    if (globalThis.prisma == null) {
        globalThis.prisma = new PrismaClient();
    }

    try {
        const record = await prisma.chatBox.create({
            data: {
                userId: userId,
                name: name,
                createdAt: new Date()
            }
        });
    } catch (error) {
        console.error("Error creating record", error);
        return NextResponse.json(
            {
                message: 'Error creating record',
            },
            {
                status: 500
            }
        )
    }
}

async function updateRecord(id: number, name: string) {
    if (globalThis.prisma == null) {
        globalThis.prisma = new PrismaClient();
    }

    try {
        const record = await prisma.chatBox.update({
            where: {
                id: id
            },
            data: {
                name: name,
                updatedAt: new Date()
            }
        });
    } catch (error) {
        console.error("Error updating record", error);
        return NextResponse.json(
            {
                message: 'Error updating record',
            },
            {
                status: 500
            }
        )
    }
}

async function deleteRecord(id: number) {
    if (globalThis.prisma == null) {
        globalThis.prisma = new PrismaClient();
    }
    try {
        const record = await prisma.chatBox.update({
            where: {
                id: id
            },
            data: {
                deletedAt: new Date()
            }
        });
    } catch (error) {
        console.error("Error deleting record", error);
        return NextResponse.json(
            {
                message: 'Error deleting record',
            },
            {
                status: 500
            }
        )
    }
}