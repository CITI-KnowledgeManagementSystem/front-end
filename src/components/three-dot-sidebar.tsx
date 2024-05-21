import React, { useState } from 'react'
import { PiDotsThreeOutlineFill } from "react-icons/pi"
import { FiDelete,FiArchive } from "react-icons/fi";
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';
import { MdDriveFileRenameOutline } from "react-icons/md";
import { Button } from './ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Separator } from './ui/separator'


interface Props {
    chatBoxId: number
}

const ThreeDotSidebar = ({ chatBoxId } : Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    // FUNCTIONS
    const preventPropagation = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setIsOpen(!isOpen)
    }

    const deleteChatBox = async () => {
        fetch(`/api/chatbox?id=${chatBoxId}`, { method: 'DELETE' }).then(res => {
            // add toast error
            if (!res.ok) {
                console.log("Error occured");
                return
            }
            console.log("Successfully delete the chatbox");
            
        })
        setIsOpen(!isOpen)
    }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
            <HoverCard openDelay={300}>
                <HoverCardTrigger asChild>
                    <button onClick={preventPropagation} className={`rounded-md hover:bg-slate-400 p-1 group-hover:block ${isOpen ? 'block' : 'hidden'}`}>
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
                <Button onClick={preventPropagation} variant={"ghost"} className='px-4 w-full rounded-none justify-between' size={"sm"}>Rename <MdDriveFileRenameOutline/></Button>
                <Button onClick={preventPropagation} variant={"ghost"} className='px-4 w-full rounded-none justify-between' size={"sm"}>Archive <FiArchive/></Button>
                <Separator/>
                <DeleteAlert deleteFunction={deleteChatBox}/>
            </div>
        </PopoverContent>
    </Popover>
  )
}

interface AlertProps {
    deleteFunction: () => Promise<void>
}

const DeleteAlert = ({ deleteFunction } : AlertProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleDelete: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
        event.stopPropagation()
        event.preventDefault();
        await deleteFunction()
    };

    const handleClickOpen = (e:React.MouseEvent<HTMLElement>) => {
        setIsOpen(!isOpen)
        e.preventDefault()
        e.stopPropagation()
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button onClick={handleClickOpen} variant={"ghost"} className='px-4 w-full rounded-none justify-between text-red-500' size={"sm"}>
                    Delete <FiDelete/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will permanently delete the selected chat.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-700' onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ThreeDotSidebar