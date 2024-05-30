"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../ui/button'
import { BsArrowLeftCircle, BsArrowRightCircle, BsPencil } from "react-icons/bs"
import { GoPlus } from "react-icons/go"
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import UserProfile from './user-profile'
import { useAuth } from '@clerk/nextjs'
import useStore from '@/lib/useStore'
import ChatName from './chat-name'
import { useParams } from 'next/navigation'

interface T {
    id: number;
    name: string;
    updatedAt: Date;
}

interface ChatBoxGroup {
    [key: string]: T[];
}

function sortChatBox(chatBox: ChatBoxGroup) {
    const sortingOrder = {
        'Today': 0,
        'Yesterday': 1,
        'Last 7 Days': 2,
        'Last 30 Days': 3,
        'December': 4,
        'November': 5,
        'October': 6,
        'September': 7,
        'August': 8,
        'July': 9,
        'June': 10,
        'May': 11,
        'April': 12,
        'March': 13,
        'February': 14,
        'January': 15,
    };

    function getSortOrder(key: string) {
        if (sortingOrder.hasOwnProperty(key)) {
            return sortingOrder[key as keyof typeof sortingOrder];
        } else {
            return new Date().getFullYear() - Number(key) + 15;
        }
    }

    const sortedKeys = Object.keys(chatBox).sort((a, b) => {
        const orderA = getSortOrder(a) as number;
        const orderB = getSortOrder(b) as number;
        return orderA - orderB;
    });

    return sortedKeys;
}


const SidebarPrompt = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [chatBox, setChatBox] = useState<ChatBoxGroup | null>(null)
    const [sortedKeys, setSortedKeys] = useState<string[]>([])
    const { userId } = useAuth()

    const setFunction = useStore((state) => state.setFunction)

    const getChatBox = async () => {
        const response = await fetch('http://localhost:3000/api/chatbox?user_id=' + userId?.toString());
        const data = await response.json();
        setChatBox(data.data as ChatBoxGroup)
        let sortedKeys = sortChatBox(data.data as ChatBoxGroup)
        setSortedKeys(sortedKeys)
    }

    useEffect(() => {
        setFunction(getChatBox)
    }, [setFunction])

    useEffect(() => {
        getChatBox()
    }, [])

    return (
        <aside className={`h-screen`}>
            <nav className={`h-full ${isOpen ? 'w-72 p-4' : 'w-0 py-4'} flex flex-col bg-slate-200 border-r shadow-sm relative duration-300 ease-in-out`}>
                {!isOpen && <HoverCard>
                    <HoverCardTrigger asChild className='w-fit mx-3'>
                        <Link href={"/prompt"}>
                            <GoPlus size={30} className='p-1 rounded-full bg-slate-200 cursor-pointer hover:bg-slate-300' />
                        </Link>
                    </HoverCardTrigger>
                    <HoverCardContent className='p-1 bg-slate-700 text-white w-fit' align='start'>
                        <p className="text-xs">
                            Create a new chat
                        </p>
                    </HoverCardContent>
                </HoverCard>}
                {isOpen ?
                    <HoverCard>
                        <HoverCardTrigger asChild className='w-fit absolute -right-10 top-1/2'>
                            <BsArrowLeftCircle onClick={() => setIsOpen(!isOpen)} className='text-slate-400 hover:text-slate-700 cursor-pointer' size={26} />
                        </HoverCardTrigger>
                        <HoverCardContent className='p-1 bg-slate-700 text-white w-fit' align='start'>
                            <p className='text-xs'>Close the sidebar</p>
                        </HoverCardContent>
                    </HoverCard>
                    :
                    <HoverCard>
                        <HoverCardTrigger asChild className='w-fit absolute -right-10 top-1/2'>
                            <BsArrowRightCircle onClick={() => setIsOpen(!isOpen)} className='text-slate-400 hover:text-slate-700 cursor-pointer' size={26} />
                        </HoverCardTrigger>
                        <HoverCardContent className='p-1 bg-slate-700 text-white w-fit' align='start'>
                            <p className='text-xs'>Open the sidebar</p>
                        </HoverCardContent>
                    </HoverCard>
                }
                {isOpen && <HoverCard openDelay={100}>
                    <HoverCardTrigger asChild>
                        <Link href={"/prompt"}>
                            <Button variant={"ghost"} className='w-full flex justify-between mb-5 relative'>
                                <div className="flex items-center gap-x-2">
                                    <Image src={"/taiwan-tech.png"} alt='logo image' width={20} height={20} />
                                    <h2 className='font-semibold'>New Chat</h2>
                                </div>
                                <BsPencil />
                            </Button>
                        </Link>
                    </HoverCardTrigger>
                    <HoverCardContent className='w-fit text-xs p-2 bg-slate-700 text-white'>
                        <p>Create a new chat</p>
                    </HoverCardContent>
                </HoverCard>}

                {isOpen && <div className='flex-1 overflow-y-auto mb-3'>
                    {
                        chatBox && sortedKeys.map((key) => {
                            return (
                                <div className="w-full my-2" key={key}>
                                    <label className='text-muted-foreground text-xs font-semibold'>{key}</label>
                                    {chatBox[key].map((item, i) => (
                                        <ChatName id={ item.id.toString() } name={ item.name } key={i}/>
                                    ))}
                                </div>
                            )
                        })
                    }
                </div>}
                {isOpen && <UserProfile />}
            </nav>
        </aside>
    )
}

export default SidebarPrompt