import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { prisma, sftpClient } from "@/db";
import { PrismaClient } from "@prisma/client";
import Client from "ssh2-sftp-client";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file");
  const title = formData.get("title");
  const topic = formData.get("topic");
  const user_id = formData.get("user_id");

  if (!title || !topic || !user_id) {
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
      file_size as number,
      user_id as string
    )) as unknown as Document;

    if (!docs_id) {
      return NextResponse.json(
        { message: "Error insert to SQL" },
        { status: 400 }
      );
    }

    const parts = filename.split(".");
    var format = "";
    if (parts.length === 1) {
      format = "";
    } else {
      format = parts[parts.length - 1].toLowerCase();
    }

    await connect();

    const exists = await sftpClient.exists(
      `${process.env.NEXT_PUBLIC_QNAP_PRIVATE_STORAGE}/${user_id}`
    );

    if (!exists) {
      try {
        await sftpClient.mkdir(
          `${process.env.NEXT_PUBLIC_QNAP_PRIVATE_STORAGE}/${user_id}`,
          true
        );
      } catch (err) {
        await disconnect();
        console.error("Error creating directory", err);
        return NextResponse.json(
          { message: "Error creating directory" },
          { status: 400 }
        );
      }
    }

    try {
      await sftpClient
        .put(
          buffer,
          `${process.env.NEXT_PUBLIC_QNAP_PRIVATE_STORAGE}/${user_id}/${docs_id}.${format}`
        )
        .then(() => {
          console.log("File uploaded successfully");
        });
    } catch (err) {
      console.error("Error uploading file", err);
      await deleteRecord(Number(docs_id));
      return NextResponse.json(
        { message: "Error uploading file" },
        { status: 400 }
      );
    } finally {
      await disconnect();
    }

    const { getToken } = auth();
    const token = await getToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_SERVER_URL}/document/insert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user_id,
          collection_name: "private",
          document_id: `${docs_id}`,
          tag: format,
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Error inserting to VDB" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "File uploaded successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const tag = request.nextUrl.searchParams.get("tag");
  const { userId } = auth();

  if (!id) {
    return NextResponse.json(
      { message: "Please provide a id" },
      { status: 400 }
    );
  }

  try {
    await connect();

    const remotePath = `${process.env.NEXT_PUBLIC_QNAP_PRIVATE_STORAGE}/${userId}/${id}.${tag}`;
    const localPath = path.join(process.cwd(), "storage", `${id}.${tag}`);

    await sftpClient.get(remotePath, localPath);

    const data = fs.readFileSync(localPath);

    const headers = new Headers();
    headers.set("Content-Type", "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename=${id}.${tag}`);

    fs.unlinkSync(localPath);

    if (!data) {
      return NextResponse.json(
        { message: "Error reading file" },
        { status: 400 }
      );
    } else {
      return new NextResponse(data, {
        statusText: "OK",
        headers,
      });
    }
  } catch (err) {
    return NextResponse.json(
      { message: `Error fetching file: ${err}` },
      { status: 500 }
    );
  } finally {
    await disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const formData = await request.formData();
  const title = formData.get("title");
  const topic = formData.get("topic");
  const id = formData.get("id");
  const isPublic = formData.get("public");
  const isPublicBool = isPublic === "true" ? true : false;

  if (!title || !topic) {
    return NextResponse.json(
      { message: "Please fill in all fields" },
      { status: 400 }
    );
  }

  updateRecord(Number(id), title as string, topic as string, isPublicBool);

  return NextResponse.json(
    { message: "Document updated successfully" },
    { status: 200 }
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const extension = await findFileWithExtension(id as string);
  const userId = request.nextUrl.searchParams.get("user_id");

  if (!id) {
    return NextResponse.json(
      { message: "Please provide a id" },
      { status: 400 }
    );
  }

  if (!extension) {
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }

  await deleteRecord(Number(id));

  const { getToken } = auth();
  const token = await getToken();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_SERVER_URL}/document/delete?document_id=${id}&collection_name=private`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { message: "Error deleting from LLM" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting from LLM", error);
    return NextResponse.json(
      { message: "Error deleting from LLM" },
      { status: 500 }
    );
  }

  try {
    await connect();
    await sftpClient.delete(
      `${process.env.NEXT_PUBLIC_QNAP_PRIVATE_STORAGE}/${userId}/${id}.${extension}`
    );
  } catch (error) {
    console.error("Error deleting file", error);
    await disconnect();
    return NextResponse.json(
      { message: "Error deleting file" },
      { status: 500 }
    );
  } finally {
    await disconnect();
  }

  return NextResponse.json(
    { message: "File deleted successfully" },
    { status: 200 }
  );
}

async function createDocument(
  title: string,
  topic: string,
  filename: string,
  file_size: number,
  user_id: string
) {
  if (globalThis.prisma == null) {
    globalThis.prisma = new PrismaClient();
  }

  try {
    const document = await prisma.document.create({
      data: {
        title: title,
        topic: topic,
        original_name: filename,
        file_size: file_size,
        createdAt: new Date(),
        userId: user_id,
      },
    });
    return document.id;
  } catch (error) {
    console.error("Error creating document", error);
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

async function findFileWithExtension(
  filenameWithoutExtension: string
): Promise<string | null> {
  try {
    const fileName = await prisma.document.findUnique({
      where: { id: Number(filenameWithoutExtension) },
    });
    const parts = fileName?.original_name.split(".") || [];
    var format = "";
    if (parts.length === 1) {
      format = "";
    } else {
      format = parts[parts.length - 1].toLowerCase();
    }
    return format;
  } catch (error) {
    console.error("Error finding document", error);
  }
  return null;
}

async function deleteRecord(id: number) {
  if (globalThis.prisma == null) {
    globalThis.prisma = new PrismaClient();
  }

  try {
    const deletedUser = await prisma.document.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error deleting document", error);
  }
}

async function updateRecord(
  id: number,
  title: string,
  topic: string,
  isPublicBool: boolean
) {
  if (globalThis.prisma == null) {
    globalThis.prisma = new PrismaClient();
  }

  try {
    const updateRecord = await prisma.document.update({
      where: { id: id },
      data: {
        title: title,
        topic: topic,
        public: isPublicBool,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating document", error);
    return NextResponse.json(
      { message: "Error updating document" },
      { status: 500 }
    );
  }
}

async function connect() {
  if (globalThis.sftpClient == null) {
    globalThis.sftpClient = new Client();
  }

  try {
    await sftpClient.connect({
      host: process.env.NEXT_PUBLIC_QNAP_SFTP_URL,
      port: process.env.NEXT_PUBLIC_QNAP_SFTP_PORT,
      username: process.env.NEXT_PUBLIC_QNAP_USERNAME,
      password: process.env.NEXT_PUBLIC_QNAP_PASSWORD,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error connecting to sftp" },
      { status: 500 }
    );
  }
}

async function disconnect() {
  try {
    await sftpClient.end();
  } catch (error) {
    console.log("Error disconnecting to sftp", error);
    return NextResponse.json(
      { message: "Error disconnecting to sftp" },
      { status: 500 }
    );
  }
}
