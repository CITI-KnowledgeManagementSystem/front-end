import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
        return NextResponse.json(
            { message: "Please provide an id" },
            { status: 400 }
        );
    }

    const list = await getListOfDocumentsByUserId(Number(id));
    
    return NextResponse.json({
        message: "List of documents",
        data: list,
        status: 200,
    });

}

async function getListOfDocumentsByUserId(userId: number) {
    const prisma = new PrismaClient();

    try {
        const list = await prisma.document.findMany({
            // where: {
            //     userId: userId,
            // },
            select: {
                id: true,
                title: true,
                topic: true,
                file_size: true,
                original_name: true,
                createdAt: true
            },
        });

        let list_new = [];

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
                tag: list[i].original_name.substring(list[i].original_name.lastIndexOf(".") + 1, list[i].original_name.length),
                file_size_formatted: sizeFormatted,
                createdAt: new Date(list[i].createdAt).toDateString()
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