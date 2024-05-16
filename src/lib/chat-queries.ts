"use server"
import { prisma } from '@/db'
import { PrismaClient } from '@prisma/client';
import { date } from 'zod';


interface T {
    id: number;
    name: string;
    updatedAt: Date;
    differenceDays: number;
}

interface ChatBoxGroup {
    "Today" : T[];
    "Yesterday" : T[];
    "Last 7 Days" : T[];
    "Last 30 Days" : T[];
    [key: string]: T[];
}

export async function getChatBox(id: string) {
    // console.log('id', id);

    if (globalThis.prisma == null) {
        console.log('prisma is null');
        globalThis.prisma = new PrismaClient();
    }

    try {
        const chatBox = await prisma.chatBox.findMany({
            where: {
                userId: id
            },
            select: {
                id: true,
                name: true,
                updatedAt: true,
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        let chatBoxGroup: ChatBoxGroup = {
            "Today" : [],
            "Yesterday" : [],
            "Last 7 Days" : [],
            "Last 30 Days" : [],
            "December" : [],
            "November" : [],
            "October" : [],
            "September" : [],
            "August" : [],
            "July" : [],
            "June" : [],
            "May" : [],
            "April" : [],
            "March" : [],
            "February" : [],
            "January" : [],
        };
        // Initialize chats as an empty array
        let i = 0;
        for (i = 0; i < chatBox.length; i++) {
            let dateNow = new Date();
            let dateChat: Date = chatBox[i].updatedAt ?? new Date();
            let differenceDays = (dateNow.getTime() - dateChat.getTime()) / (1000 * 3600 * 24); ;
            console.log('differenceDays', differenceDays);
            if (differenceDays <= 1) {
                chatBoxGroup['Today'] = chatBoxGroup['Today'] ?? [];
                chatBoxGroup['Today'].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date(),
                    differenceDays : differenceDays
                });
            }
            else if (differenceDays <= 2) {
                chatBoxGroup['Yesterday'] = chatBoxGroup['Yesterday'] ?? [];
                chatBoxGroup['Yesterday'].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date(),
                    differenceDays : differenceDays
                });
            }
            else if (differenceDays <= 7){
                chatBoxGroup['Last 7 Days'] = chatBoxGroup['Last 7 Days'] ?? [];
                chatBoxGroup['Last 7 Days'].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date(),
                    differenceDays : differenceDays
                });
            }
            else if (differenceDays <= 30) {
                chatBoxGroup['Last 30 Days'] = chatBoxGroup['Last 30 Days'] ?? [];
                chatBoxGroup['Last 30 Days'].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date(),
                    differenceDays : differenceDays
                });
            }
            else if (dateNow.getFullYear() === dateChat.getFullYear()) {
                let month = dateChat.getMonth();
                let monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                chatBoxGroup[monthName[month]] = chatBoxGroup[monthName[month]] ?? [];
                chatBoxGroup[monthName[month]].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date(),
                    differenceDays : differenceDays
                });
            }
            else {
                chatBoxGroup[dateChat.getFullYear()] = chatBoxGroup[dateChat.getFullYear()] ?? [];
                chatBoxGroup[Number(dateChat.getFullYear())].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date(),
                    differenceDays : differenceDays
                });
            }
        }
        console.log('chatBoxGroup', i)
        return chatBoxGroup;
    } catch (error) {
        console.log(error);
    }
    return null
}