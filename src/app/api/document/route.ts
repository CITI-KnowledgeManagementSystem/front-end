import { NextResponse, NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { prisma, sftp_client } from "@/db";
import { PrismaClient } from "@prisma/client";
import { Form } from "react-hook-form";
import { global } from "styled-jsx/css";
import Client from "ssh2-sftp-client";
import test from "node:test";

export async function POST(req: Response) {
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
      // If there's no '.' in the filename or it starts with a dot
      format = ""; // No file format found or empty file format
    } else {
      // The last part is the extension
      format = parts[parts.length - 1].toLowerCase();
    }

    // await writeFile(
    //     path.join(process.cwd(), "storage/" + docs_id + "." + format),
    //     buffer
    // );

    testConnection();

    // await connect();

    // const exists = await sftp_client.exists(`/LKC/private/${user_id}`);

    // if (!exists) {
    //   await sftp_client.mkdir(`/LKC/private/${user_id}`, true);
    // }

    // await sftp_client
    //   .put(buffer, `/LKC/private/${user_id}/${filename}.${format}`)
    //   .then(() => {
    //     console.log("File uploaded successfully");
    //   })
    //   .then(() => {
    //     disconnect();
    //   })
    //   .catch(() => {
    //     return NextResponse.json(
    //       { message: "Error uploading file" },
    //       { status: 400 }
    //     );
    //   });

    return NextResponse.json(
      { message: "File uploaded successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
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
      { status: 400 }
    );
  } else {
    return new NextResponse(data, {
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
  return NextResponse.json(
    { message: "Document updated successfully" },
    { status: 200 }
  );
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

  // if (!extension) {
  //   return NextResponse.json({ message: "File not found" }, { status: 404 });
  // }

  try {
    fs.unlinkSync(path.join(process.cwd(), "storage/", id + extension));
  } catch (err) {
    console.error("Error deleting file", err);
  }

  await deleteRecord(Number(id));

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

async function updateRecord(id: number, title: string, topic: string) {
  if (globalThis.prisma == null) {
    globalThis.prisma = new PrismaClient();
  }

  try {
    const updateRecord = await prisma.document.update({
      where: { id: id },
      data: {
        title: title,
        topic: topic,
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
  if (globalThis.sftp_client == null) {
    globalThis.sftp_client = new Client();
  }

  try {
    await sftp_client.connect({
      host: process.env.NEXT_PUBLIC_QNAP_SFTP_URL,
      port: process.env.NEXT_PUBLIC_QNAP_SFTP_PORT,
      username: process.env.NEXT_PUBLIC_QNAP_USERNAME,
      password: process.env.NEXT_PUBLIC_QNAP_PASSWORD,
    });
  } catch (error) {
    console.log("Error connecting to sftp", error);
    return NextResponse.json(
      { message: "Error connecting to sftp" },
      { status: 500 }
    );
  }
}

async function disconnect() {
  try {
    await sftp_client.end();
  } catch (error) {
    console.log("Error disconnecting to sftp", error);
    return NextResponse.json(
      { message: "Error disconnecting to sftp" },
      { status: 500 }
    );
  }
}

async function testConnection() {
  const config = {
    host: process.env.NEXT_PUBLIC_QNAP_SFTP_URL,
    port: process.env.NEXT_PUBLIC_QNAP_SFTP_PORT,
    username: process.env.NEXT_PUBLIC_QNAP_USERNAME,
    password: process.env.NEXT_PUBLIC_QNAP_PASSWORD,
  };

  try {
    await sftp_client.connect(config);
    console.log("Connected to SFTP server");
  } catch (error) {
    console.error("Error connecting to SFTP:", error);
  } finally {
    await sftp_client.end();
  }
}
