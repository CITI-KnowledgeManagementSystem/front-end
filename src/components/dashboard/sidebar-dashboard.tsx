"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '../ui/button';
import { dashboardMenu } from '@/constants'
import { SidebarItems } from '@/types'

const SidebarDashboard = () => {
    const [sidebarItems, setSidebarItems] = useState<SidebarItems[]>(dashboardMenu)
    const params = useParams()
    
    
  return (
    <aside className='h-screen'>
        <nav className='w-72 border-r h-full shadow p-3 bg-white'>
            <div className="flex items-center">

            </div>
            <div className="w-full">
                { sidebarItems.map((item, i) => (
                    <Link href={ '/dashboard/' + item.url } key={i}>
                        <Button variant={"ghost"} key={i} className={`w-full justify-start ${item.url === params.pageName && 'bg-blue-700 text-white hover:bg-blue-700 hover:text-white'}`}>
                            {item.icon && <item.icon className='mr-3' size={20}/>}
                            { item.name }
                        </Button>
                    </Link>
                )) }
            </div>
        </nav>
    </aside>
  )
}

export default SidebarDashboard