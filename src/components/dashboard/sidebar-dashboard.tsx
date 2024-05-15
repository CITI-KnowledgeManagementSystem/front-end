"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go"
import { CiLogout } from "react-icons/ci";
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Button } from '../ui/button';
import { dashboardMenu } from '@/constants'
import { SidebarItems } from '@/types'

const SidebarDashboard = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [sidebarItems, setSidebarItems] = useState<SidebarItems[]>(dashboardMenu)
    const pathname = usePathname()
    
    
    
    
  return (
    <aside className='h-screen'>
        <nav className={`${isOpen ? 'w-72' : 'w-20'} border-r h-full shadow p-3 bg-white shadow-sm relative transition-all duration-300 ease-in-out flex flex-col justify-between items-center`}>
            <HoverCard openDelay={1000}>
                <div className={`flex ${isOpen ? "justify-end" : 'justify-center'} w-full`}>
                    <HoverCardTrigger asChild className='w-fit'>
                        <Button className="mt-2 mb-5 px-2" variant={"ghost"} onClick={() => setIsOpen(!isOpen)}>
                            { isOpen ? <GoSidebarExpand className='text-muted-foreground hover:text-blue-700 cursor-pointer' size={20}/> : <GoSidebarCollapse className='text-muted-foreground hover:text-blue-700 cursor-pointer' size={20}/>}
                        </Button>
                    </HoverCardTrigger>
                </div>
                <HoverCardContent className='p-1 bg-slate-700 text-white w-fit border-none' align='start'>
                    { isOpen ? <p className="text-xs">Collapse sidebar</p> : <p className="text-xs">Expand sidebar</p> }
                </HoverCardContent>
            </HoverCard>

            <div className="flex items-center">
                <h1 className="">
                    
                </h1>
            </div>

            <div className="w-full flex-1">
                { sidebarItems.map((item, i) => (
                    <HoverCard key={i}>
                        <HoverCardTrigger asChild className='flex flex-col items-center'>
                            <Link href={ '/dashboard/' + item.url } key={i} className='my-1'>
                                <Button variant={"ghost"} key={i} className={`${isOpen ? 'w-full justify-start' : 'w-fit px-2'} ${item.url === pathname.split("/")[2] && 'bg-blue-700 text-white hover:bg-blue-700 hover:text-white'}`}>
                                    {item.icon && <item.icon className={isOpen ? 'mr-3' : 'm-0'} size={20}/>}
                                    { isOpen && <p className="transition-opacity duration-1000">{ item.name }</p> }
                                </Button>
                            </Link>
                        </HoverCardTrigger>
                        {!isOpen && <HoverCardContent className='p-1 bg-slate-700 text-white w-fit' align={isOpen ? 'center' : 'start'}>
                            <p className='text-xs'>{ item.name }</p>
                        </HoverCardContent>}
                    </HoverCard>
                )) }
            </div>

            <HoverCard>
                <HoverCardTrigger asChild className='w-fit flex items-center justify-center'>
                    <Link href={"/log-out"} className='w-full'>
                        <Button variant={"ghost"} className={`${isOpen ? 'w-full justify-start' : 'w-fit px-2'} text-red-600 hover:text-red-700`}>
                            <CiLogout className={isOpen ? 'mr-3' : 'm-0'} size={20}/>
                            { isOpen && "Logout"}
                        </Button> 
                    </Link>
                </HoverCardTrigger>
                {!isOpen && <HoverCardContent className='p-1 bg-slate-700 text-white w-fit' align={isOpen ? 'center' : 'start'}>
                    <p className='text-xs'>Logout</p>
                </HoverCardContent>}
            </HoverCard>
        </nav>
    </aside>
  )
}

export default SidebarDashboard