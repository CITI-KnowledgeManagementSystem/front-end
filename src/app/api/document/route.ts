import { NextResponse, NextRequest } from "next/server";
import { access, writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";

export async function POST(req: Response) {
    const prisma = new PrismaClient();
    const formData = await req.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const topic = formData.get("topic");

    if (!title || !topic) {
        return NextResponse.json(
            { message: "Please fill in all fields" },
            { status: 400 }
        );
    }

    if (!file) {
        return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await (file as File).arrayBuffer());
    const filename = (file as File).name.replaceAll(" ", "_");
    const file_size = Buffer.byteLength(buffer, "utf8");

    try {
        const docs_id = (await createDocument(
            title as string,
            topic as string,
            filename,
            file_size as number
        )) as unknown as Document;

        if (!docs_id) {
            return NextResponse.json({ message: "Error insert to SQL", status: 500 });
        }

        const parts = filename.split(".");
        if (parts.length === 1) {
            // If there's no '.' in the filename or it starts with a dot
            return ""; // No file format found or empty file format
        }
        const format = parts[parts.length - 1].toLowerCase();

        await writeFile(
            path.join(process.cwd(), "storage/" + docs_id + "." + format),
            buffer
        );

        return NextResponse.json({
            message: "File uploaded successfully",
            status: 201,
        });
    } catch (err) {
        return NextResponse.json({ message: "Error Occured", status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
        return NextResponse.json(
            { message: "Please provide a id" },
            { status: 400 }
        );
    }

    const files = searchFilesByName(
        path.join(process.cwd(), "storage"),
        id as string
    );

    if (files.length === 0) {
        return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    const data = fs.readFileSync(path.join(process.cwd(), "storage/", files[0]));
    const sizeInBytes = Buffer.byteLength(data, "utf8");

    const headers = new Headers();
    headers.set("Content-Type", "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename=${files[0]}`);

    if (!data) {
        return NextResponse.json(
            { message: "Error reading file" },
            { status: 500 }
        );
    } else {
        return new NextResponse(data, {
            status: 200,
            statusText: "OK",
            headers,
        });
    }
}

export async function PUT(request: NextRequest) {
    const formData = await request.formData();
    const title = formData.get("title");
    const topic = formData.get("topic");

    if (!title || !topic) {
        return NextResponse.json(
            { message: "Please fill in all fields" },
            { status: 400 }
        );
    }

    updateRecord(Number(formData.get("id")), title as string, topic as string);
    return NextResponse.json({ message: "Document updated successfully", status: 200 });

}

export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    const extension = findFileWithExtension(
        path.join(process.cwd(), "storage"),
        id as string
    );

    if (!id) {
        return NextResponse.json(
            { message: "Please provide a id" },
            { status: 400 }
        );
    }

    if (!extension) {
        return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    try {
        fs.unlinkSync(path.join(process.cwd(), "storage/", id + extension));
    } catch (err) {
        console.error("Error deleting file", err);
    }

    deleteRecord(Number(id));

    return NextResponse.json({ message: "File deleted successfully" });
}

async function createDocument(
    title: string,
    topic: string,
    filename: string,
    file_size: number
) {
    const prisma = new PrismaClient();
    try {
        const document = await prisma.document.create({
            data: {
                title: title,
                topic: topic,
                original_name: filename,
                file_size: file_size,
            },
        });
        return document.id;
    } catch (error) {
        console.error("Error creating document", error);
    } finally {
        await prisma.$disconnect();
    }
}

function searchFilesByName(directory: string, fileName: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(directory); // Synchronously read the directory

    entries.forEach((entry) => {
        const fullPath = path.join(directory, entry);
        const stats = fs.statSync(fullPath);

        if (stats.isFile()) {
            const baseName = path.basename(entry, path.extname(entry)); // Get the filename without extension
            if (baseName === fileName) {
                files.push(entry);
            }
        }
    });

    return files;
}

function findFileWithExtension(
    directory: string,
    filenameWithoutExtension: string
): string | null {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const ext = path.extname(file); // Get the extension of the current file
        const nameWithoutExt = path.basename(file, ext); // Get the name of the file without extension
        if (nameWithoutExt === filenameWithoutExtension) {
            return ext; // Return the extension if the filename matches
        }
    }
    return null; // Return null if the file is not found
}

async function deleteRecord(id: number) {
    const prisma = new PrismaClient();
    try {
        const deletedUser = await prisma.document.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error("Error deleting document", error);
    } finally {
        await prisma.$disconnect();
    }
}

async function updateRecord(id: number, title: string, topic: string) {
    const prisma = new PrismaClient();
    try {
        const updateRecord = await prisma.document.update({
            where: { id: id },
            data: {
                title: title,
                topic: topic,
            },
        });
    } catch (error) {
        console.error("Error updating document", error);
        return NextResponse.json({ message: "Error updating document", status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
