import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";

export async function GET(request: NextRequest) {
  try {
    // Ambil semua ID dari query parameter, contoh: /api/documents/batch?ids=1&ids=98
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("ids");

    if (!ids || ids.length === 0) {
      return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
    }

    // Ubah list ID dari string jadi angka, karena di DB tipenya integer
    const documentIds = ids.map(id => parseInt(id, 10));

    // Cari semua dokumen yang ID-nya ada di dalam list `documentIds`
    const documents = await prisma.document.findMany({
      where: {
        id: {
          in: documentIds,
        },
      },
      // Ambil hanya kolom yang kita butuhin buat ditampilin
      select: {
        id: true,
        title: true,
        original_name: true,
        topic: true,
      }
    });

    return NextResponse.json(documents);

  } catch (error) {
    console.error("Failed to fetch documents by batch:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}