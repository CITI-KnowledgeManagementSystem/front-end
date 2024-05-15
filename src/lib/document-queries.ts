"use server"
import { prisma } from "@/db"

export async function accumulatedSizeOfDocuments(id : string) {
    try {
        const documents = await prisma.document.groupBy({
            by: ['userId'],
            _sum: {
                file_size: true,
            },
            where: {
                userId: id,
            },
        });

        const file_size= (documents[0]._sum.file_size ? documents[0]._sum.file_size / (1024 * 1024 * 1024) : 0) 
        return Number(file_size.toFixed(2))
    } catch (err) {
        console.error('Error fetching documents', err);
    }
}


export async function numberOfDocuments(id : string) {
    try {
        const documents = await prisma.document.count({
            where: {
                userId: id,
            },
        });
        return documents;
    } catch (err) {
        console.error('Error fetching documents', err);
    }
}