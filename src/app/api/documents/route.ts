import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";
import { BsTrophy } from "react-icons/bs";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    const skip = request.nextUrl.searchParams.get("skip");
    const take = request.nextUrl.searchParams.get("take");

    if (!id) {
        return NextResponse.json(
            { message: "Please provide an id" },
            { status: 400 }
        );
    }

    const list = await getListOfDocumentsByUserId(Number(id), Number(skip), Number(take));
    return NextResponse.json(
        {
            message: "List of documents",
            data: list
        },
        {
            status: 200
        }
    );

}

async function getListOfDocumentsByUserId(userId: number, skip: number, take: number) {
    const prisma = new PrismaClient();
    if (!take) {
        take = 10;
    }
    if (!skip) {
        skip = 0;
    }
    try {
        const list = await prisma.document.findMany({
            skip: skip,
            take: take,
            where: {
                userId: userId,
            },
            select: {
                id: true,
                title: true,
                topic: true,
                file_size: true,
                original_name: true,
            },
        });
        let list_new = [];
        console.log(typeof (list[0]))
        for (let i = 0; i < list.length; i++) {
            let sizeFormatted = '';
            if (list[i].file_size < 1024) {
                sizeFormatted = list[i].file_size + ' B';
            }
            else if (list[i].file_size < 1024 * 1024) {
                sizeFormatted = (list[i].file_size / 1024).toFixed(2) + ' KB';
            }
            else if (list[i].file_size < 1024 * 1024 * 1024) {
                sizeFormatted = (list[i].file_size / (1024 * 1024)).toFixed(2) + ' MB';
            }
            else {
                sizeFormatted = (list[i].file_size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
            }

            list_new.push({
                id: list[i].id,
                title: list[i].title,
                topic: list[i].topic,
                file_size: list[i].file_size,
                file_size_formatted: sizeFormatted,
                original_name: list[i].original_name,
            });
        }
        return list_new;
    }
    catch (err) {
        console.error("Error getting list of documents", err);
        return NextResponse.json(
            { message: "Error getting list of documents" },
            { status: 500 }
        );
    }
}