import { NextResponse, NextRequest } from 'next/server';
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
        return documents;
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