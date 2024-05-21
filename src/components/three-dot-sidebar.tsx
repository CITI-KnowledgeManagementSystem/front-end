import React, { useState } from 'react'
import { PiDotsThreeOutlineFill } from "react-icons/pi"
import { FiDelete,FiArchive } from "react-icons/fi";
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';
import { MdDriveFileRenameOutline } from "react-icons/md";
import { Button } from './ui/button'
import { Separator } from './ui/separator'

interface ChildProps {
    id: number;
    updateRename: (newValue: number) => void;
}

const ThreeDotSidebar: React.FC<ChildProps> = ({ id, updateRename }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className='relative'>
            <HoverCard openDelay={300}>
                <HoverCardTrigger asChild>
                    <button className={`rounded-md hover:bg-slate-400 p-1 group-hover:block ${isOpen ? 'block' : 'hidden'}`}>
                        <PiDotsThreeOutlineFill/>
                    </button>
                </HoverCardTrigger>
                <HoverCardContent className='z-40 w-fit text-xs py-1 px-2 bg-slate-700 text-white rounded-md mt-1'>
                    <p>More</p>
                </HoverCardContent>
            </HoverCard>
        </PopoverTrigger>
        <PopoverContent className='w-32 p-0' align='end'>
            <div className="">
                <Button variant={"ghost"} className='px-4 w-full rounded-none justify-between' size={"sm"} onClick={() => updateRename(id)}>Rename<MdDriveFileRenameOutline/></Button>
                <Button variant={"ghost"} className='px-4 w-full rounded-none justify-between' size={"sm"}>Archive <FiArchive/></Button>
                <Separator/>
                <Button variant={"ghost"} className='px-4 w-full rounded-none justify-between text-red-500' size={"sm"}>Delete<FiDelete/></Button>
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default ThreeDotSidebar