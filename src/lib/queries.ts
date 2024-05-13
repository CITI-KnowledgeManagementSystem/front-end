"use server"
import { PrismaClient } from '@prisma/client';

export async function accumulatedSizeOfDocuments(id : number) {
    const prisma = new PrismaClient();
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

        const file_size= (documents[0]._sum.file_size ? documents[0]._sum.file_size / (1000 * 1000 * 1000) : 0) 
        return Number(file_size.toFixed(2))
    } catch (err) {
        console.error('Error fetching documents', err);
    } finally {
        await prisma.$disconnect();
    }
}

export async function numberOfDocuments(id : number) {
    const prisma = new PrismaClient();
    try {
        const documents = await prisma.document.count({
            where: {
                userId: id,
            },
        });
        return documents;
    } catch (err) {
        console.error('Error fetching documents', err);
    } finally {
        await prisma.$disconnect();
    }
}