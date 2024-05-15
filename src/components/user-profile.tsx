import React, { useEffect, useState } from 'react'
import { getUserInfo } from '@/lib/user-queries'
import { useAuth } from "@clerk/nextjs";
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import Link from "next/link"
import { UserProfileProps } from '@/types'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { FaUserEdit } from "react-icons/fa"
import { MdDashboard } from "react-icons/md"
import { IoIosLogOut } from "react-icons/io"

const UserProfile =  () => {
    const { userId } = useAuth() 
    const [user, setUser] = useState<UserProfileProps | null>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        getUserInfo(userId || "").then(res => {
            setUser(res)
            setIsLoading(false)
        })
    }, [])


    if (isLoading)
        return (
            <p className="text-sm">Waiting user's info...</p>
        )
    else if (!user) {
        return (
            <p className="text-sm text-red-700">User doesn't exist.</p>
        )
    }
    
  return (
    <Popover>
        <PopoverTrigger>
        <div className='h-fit w-full justify-start hover:bg-slate-100 flex items-center rounded-md py-2 px-4 text-sm'>
            <Avatar className='mr-3'>
                <AvatarImage src={user?.img_url} />
                <AvatarFallback>{ user?.first_name[0] || "" + user?.last_name[0] }</AvatarFallback>
            </Avatar>
            { user?.username }
        </div>
        </PopoverTrigger>
        <PopoverContent className='w-full p-1' align='center'>
            <div className="w-48">
                <Link href={"/dashboard/my-documents"} shallow>
                    <Button className='w-full justify-start' variant={"ghost"} size={"sm"}>
                        <MdDashboard className='mr-3' size={16}/>
                        Go to your dashboard
                    </Button>
                </Link>
                <Button className='w-full justify-start' variant={"ghost"} size={"sm"}>
                    <FaUserEdit className='mr-3' size={16}/>
                    Profile Settings
                </Button>
                <Separator className='my-1'/>
                <Link href={"/log-out"}>
                    <Button className='w-full text-red-500 justify-start' variant={"ghost"} size={"sm"}>
                        <IoIosLogOut className='mr-3' size={16}/>
                        Logout
                    </Button>
                </Link>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default UserProfile