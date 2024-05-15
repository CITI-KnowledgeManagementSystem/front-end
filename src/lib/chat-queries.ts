"use server"
import { prisma } from '@/db'
import { PrismaClient } from '@prisma/client';
import { date } from 'zod';


interface T {
    id: number;
    name: string;
    updatedAt: Date;
}

interface ChatBoxGroup {
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
        let chatBoxGroup: ChatBoxGroup = {};
        // Initialize chats as an empty array
        for (let i = 0; i < chatBox.length; i++) {
            let dateNow = new Date();
            let dateChat: Date = chatBox[i].updatedAt ?? new Date();
            let dateDiff = dateNow.getDate() - dateChat.getDate();
            console.log('dateDiff', dateDiff);
            if (dateDiff === 0) {
                chatBoxGroup['Today'] = chatBoxGroup['Today'] ?? [];
                chatBoxGroup['Today'].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date()
                });
            }
            else if (dateDiff === 1) {
                chatBoxGroup['Yesterday'] = chatBoxGroup['Yesterday'] ?? [];
                chatBoxGroup['Yesterday'].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date()
                });
            }
            else if (dateDiff <= 7){
                chatBoxGroup['Last 7 Days'] = chatBoxGroup['Last 7 Days'] ?? [];
                chatBoxGroup['Last 7 Days'].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date()
                });
            }
            else if (dateDiff <= 30) {
                chatBoxGroup['Last 30 Days'] = chatBoxGroup['Last 30 Days'] ?? [];
                chatBoxGroup['Last 30 Days'].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date()
                });
            }
            else if (dateNow.getFullYear() === dateChat.getFullYear()) {
                chatBoxGroup['This Year'] = chatBoxGroup['This Year'] ?? [];
                chatBoxGroup['This Year'].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date()
                });
            }
            else {
                chatBoxGroup[dateChat.getFullYear()] = chatBoxGroup[dateChat.getFullYear()] ?? [];
                chatBoxGroup[dateChat.getFullYear()].push({
                    id: chatBox[i].id,
                    name: chatBox[i].name,
                    updatedAt: chatBox[i].updatedAt ?? new Date()
                });
            }
        }        
        console.log('chatBox', chatBoxGroup);
        return chatBoxGroup;
    } catch (error) {
        console.log(error);
    }
    return null
}