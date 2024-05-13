"use server"
import { PrismaClient } from "@prisma/client"

// get users document size
export async function getUserUsedStorage(userId:number) {
    const prisma = new PrismaClient();
    console.log("Getting the user storage");
    
    try {
        const query = await prisma.document.aggregate({
            where: {
                userId
            },
            _sum: { file_size: true }
        })

        const userFileSize = query._sum.file_size ? query._sum.file_size / (1000 * 1000 * 1000) : 0

        return Number(userFileSize.toFixed(2))
    } catch (error) {
        console.log(error);
        return 0
    }
}