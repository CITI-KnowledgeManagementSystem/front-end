import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { FaUserEdit } from "react-icons/fa"
import { MdDashboard } from "react-icons/md"
import { IoIosLogOut } from "react-icons/io";

const UserProfile = () => {
  return (
    <Popover>
        <PopoverTrigger>
            <div className='h-fit w-full justify-start hover:bg-slate-100 flex items-center rounded-md py-2 px-4 text-sm'>
                <Avatar className='mr-3'>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                Rainata Putra
            </div>
        </PopoverTrigger>
        <PopoverContent className='w-full p-1' align='center'>
            <div className="w-48">
                <Button className='w-full justify-start' variant={"ghost"} size={"sm"}>
                    <MdDashboard className='mr-3' size={16}/>
                    Go to your dashboard
                </Button>
                <Button className='w-full justify-start' variant={"ghost"} size={"sm"}>
                    <FaUserEdit className='mr-3' size={16}/>
                    Profile Settings
                </Button>
                <Separator className='my-1'/>
                <Button className='w-full text-red-500 justify-start' variant={"ghost"} size={"sm"}>
                    <IoIosLogOut className='mr-3' size={16}/>
                    Logout
                </Button>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default UserProfile