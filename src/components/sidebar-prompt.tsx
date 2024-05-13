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


const dummyChats = [
    {
        dateGroup: "Today",
        chats:[
            {
                chatTitle: "How to cook a chicken"
            },
            {
                chatTitle: "How to beatbox"
            },
            {
                chatTitle: "How to cook a chicken"
            },
            {
                chatTitle: "How to beatbox"
            },
            {
                chatTitle: "How to cook a chicken"
            },
            {
                chatTitle: "How to beatbox"
            },
            {
                chatTitle: "How to cook a chicken"
            },
            {
                chatTitle: "How to beatbox"
            },
            {
                chatTitle: "How to cook a chicken"
            },
            {
                chatTitle: "How to beatbox"
            },
            {
                chatTitle: "How to cook a chicken"
            },
            {
                chatTitle: "How to beatbox"
            },
            {
                chatTitle: "How to cook a chicken"
            },
            {
                chatTitle: "How to beatbox"
            },

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
    const [isOpen, setIsOpen] = useState(false)

  return (
    <aside className={`h-screen`}>
        <nav className={`h-full ${isOpen ? 'w-72 p-4' : 'w-0 py-4'} flex flex-col bg-slate-200 border-r shadow-sm relative duration-300 ease-in-out`}>
            {!isOpen && <HoverCard>
                <HoverCardTrigger asChild className='w-fit mx-3'>
                    <Link href={"/prompt"}>
                        <GoPlus size={30} className='p-1 rounded-full bg-slate-200 cursor-pointer hover:bg-slate-300'/>
                    </Link>
                </HoverCardTrigger>
                <HoverCardContent className='p-1 bg-slate-700 text-white w-fit' align='start'>
                    <p className="text-xs">
                        Create a new chat
                    </p>
                </HoverCardContent>
            </HoverCard>}
            { isOpen ? 
                <HoverCard>
                    <HoverCardTrigger asChild className='w-fit absolute -right-10 top-1/2'>
                        <BsArrowLeftCircle onClick={() => setIsOpen(!isOpen)} className='text-slate-400 hover:text-slate-700 cursor-pointer' size={26}/>
                    </HoverCardTrigger>
                    <HoverCardContent className='p-1 bg-slate-700 text-white w-fit' align='start'>
                        <p className='text-xs'>Close the sidebar</p>
                    </HoverCardContent>
                </HoverCard>
                :
                <HoverCard>
                    <HoverCardTrigger asChild className='w-fit absolute -right-10 top-1/2'>
                        <BsArrowRightCircle onClick={() => setIsOpen(!isOpen)} className='text-slate-400 hover:text-slate-700 cursor-pointer' size={26}/>
                    </HoverCardTrigger>
                    <HoverCardContent className='p-1 bg-slate-700 text-white w-fit' align='start'>
                        <p className='text-xs'>Open the sidebar</p>
                    </HoverCardContent>
                </HoverCard>
            }
            {isOpen && <HoverCard openDelay={300}>
                <HoverCardTrigger asChild>
                    <Link href={"/prompt"}>
                        <Button variant={"ghost"} className='w-full flex justify-between mb-5 relative'>
                            <div className="flex items-center gap-x-2">
                                <Image src={"/taiwan-tech.png"} alt='logo image' width={20} height={20} />
                                <h2 className='font-semibold'>New Chat</h2>
                            </div>
                            <BsPencil/>
                        </Button>
                    </Link>
                </HoverCardTrigger>
                <HoverCardContent className='w-fit text-xs p-2 bg-slate-700 text-white'>
                    <p>Create a new chat</p>
                </HoverCardContent>
            </HoverCard>}

            {isOpen && <div className='flex-1 overflow-y-auto mb-3'>
            { dummyChats.map((item, i) => (
                <div className="w-full my-2" key={i}>
                    <label className='text-muted-foreground text-xs font-semibold'>{ item.dateGroup }</label>
                    { item.chats.map((item, i) => (
                        <Button key={i} variant={"ghost"} className={`flex justify-between items-center w-full relative group ${i === 1 && 'bg-white hover:bg-white'}`}>
                            { item.chatTitle.length > 20 ? item.chatTitle.slice(0,20) : item.chatTitle }
                            <ThreeDotSidebar/>
                        </Button>
                    )) }
                </div>
            )) }
            </div>}

            {isOpen && <UserProfile/>}
        </nav>
    </aside>
  )
}

export default SidebarPrompt