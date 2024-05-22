"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from './ui/button'
import { BsArrowLeftCircle, BsArrowRightCircle, BsPencil } from "react-icons/bs"
import { GoPlus } from "react-icons/go"
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import UserProfile from './user-profile'
import ThreeDotSidebar from './three-dot-sidebar'
import { useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation'
import useSWR from 'swr'
import { Input } from "@/components/ui/input"
import { set } from 'react-hook-form'

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
    const [isOpen, setIsOpen] = useState(false)
    const [chatBox, setChatBox] = useState<ChatBoxGroup | null>(null)
    const [sortedKeys, setSortedKeys] = useState<string[]>([])
    const [isRename, setIsRename] = useState<Number | null>(0)
    const { userId } = useAuth()
    const pathname = usePathname()

    const updateRename = (newValue: any) => {
        setIsRename(newValue);
    }

    const updateChatBox = async (id: Number, newValue: any) => {
        const formData = new FormData();
        formData.append('id', id.toString());
        formData.append('name', newValue);
        
        try {
            const response = await fetch('http://localhost:3000/api/chatbox', {
                method: 'PUT',
                body: formData,
            });
        }
        catch (error) {
            console.error('Error:', error);
        }
        return void 0;
    }

    const getChatBox = async () => {
        const response = await fetch('http://localhost:3000/api/chatbox?user_id=' + userId?.toString());
        const data = await response.json();
        return data;
    }

    useEffect(() => {
        getChatBox().then((data) => {
            setChatBox(data.data as ChatBoxGroup)
            let sortedKeys = sortChatBox(data.data as ChatBoxGroup);
            setSortedKeys(sortedKeys)
        });
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
                                    {chatBox[key].length === 0 ? null : (
                                        <>
                                            <label className='text-muted-foreground text-xs font-semibold'>{key}</label>
                                            {chatBox[key].map((item, i) => (
                                                <Link href={"/prompt/" + item.id}>
                                                    <Button key={i} variant={"ghost"} className={`flex justify-between items-center w-full relative group ${item.id.toString() === pathname?.split('/')[2] && 'bg-white hover:bg-white'}`}>
                                                        {isRename !== item.id ?
                                                         item.name.length > 20 ? item.name.slice(0, 20) : item.name
                                                                :
                                                                <Input type='text' defaultValue={item.name} 
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        try {
                                                                            updateChatBox(item.id, e.target.value)
                                                                            setChatBox({ ...chatBox, [key]: chatBox[key].map((chat) => chat.id === item.id ? { ...chat, name: e.target.value } : chat) })
                                                                            item.name = e.target.value
                                                                        }
                                                                        catch (error) {
                                                                            console.error('Error:', error);
                                                                        }
                                                                        setIsRename(null)
                                                                    }
                                                                }}
                                                                />
                                                            }
                                                        <ThreeDotSidebar updateRename={updateRename} id={item.id} />
                                                    </Button>
                                                </Link>
                                            ))}
                                        </>
                                    )}
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