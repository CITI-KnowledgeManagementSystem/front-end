"use client"
import React from 'react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { BsPencil } from "react-icons/bs"
import UserProfile from './user-profile'
import ThreeDotSidebar from './three-dot-sidebar'

// functions
import { parseDate } from '@/lib/utils'

const dummyChats = [
    {
        dateGroup: "Today",
        chats:[
            {
                chatTitle: "How to cook a chicken"
            },
            {
                chatTitle: "How to beatbox"
            }
        ]
    },
    {
        dateGroup: "A While Ago",
        chats:[
            {
                chatTitle: "How to buy a noodel in mandarin language"
            },
            {
                chatTitle: "How to fly to mars"
            }
        ]
    },
]

const SidebarPrompt = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

  return (
    <div className='border border-r px-3 py-5 flex flex-col w-72 justify-between'>
        <Button variant={"ghost"} className='flex justify-between mb-5'>
            <div className="flex items-center gap-x-2">
                <Image src={"/taiwan-tech.png"} alt='logo image' width={20} height={20} />
                <h2 className='font-semibold'>New Chat</h2>
            </div>
            <BsPencil/>
        </Button>

        <div className='flex-1'>
        { dummyChats.map((item, i) => (
            <div className="w-full my-2" key={i}>
                <label className='text-muted-foreground text-xs font-semibold'>{ item.dateGroup }</label>
                { item.chats.map((item, i) => (
                    <Button key={i} variant={"ghost"} className='flex justify-between items-center w-full'>
                        { item.chatTitle.length > 20 ? item.chatTitle.slice(0,20) : item.chatTitle }
                        <ThreeDotSidebar/>
                    </Button>
                )) }
            </div>
        )) }
        </div>
        
        <UserProfile/>
    </div>
  )
}

export default SidebarPrompt