import React from 'react'
import { PiDotsThreeOutlineFill } from "react-icons/pi"
import { FiDelete,FiArchive } from "react-icons/fi";
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { MdDriveFileRenameOutline } from "react-icons/md";
import { Button } from './ui/button'
import { Separator } from './ui/separator'

const ThreeDotSidebar = () => {
  return (
    <Popover>
        <PopoverTrigger>
            <button className="rounded-md hover:bg-slate-400 p-1">
                <PiDotsThreeOutlineFill/>
            </button>
        </PopoverTrigger>
        <PopoverContent className='w-32 p-0' align='end'>
            <div className="">
                <Button variant={"ghost"} className='px-4 w-full rounded-none justify-between' size={"sm"}>Rename <MdDriveFileRenameOutline/></Button>
                <Button variant={"ghost"} className='px-4 w-full rounded-none justify-between' size={"sm"}>Archive <FiArchive/></Button>
                <Separator/>
                <Button variant={"ghost"} className='px-4 w-full rounded-none justify-between text-red-500' size={"sm"}>Delete <FiDelete/></Button>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default ThreeDotSidebar