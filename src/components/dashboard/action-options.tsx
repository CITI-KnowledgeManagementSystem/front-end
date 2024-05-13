import React, { Dispatch, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent ,AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import Link from "next/link"
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { FiDelete } from "react-icons/fi"
import { MdOutlineFileDownload } from "react-icons/md";
import { TableContentProps } from '@/types'

type Props = {
    documentId: string,
    tableContents: TableContentProps[],
    setTableContents: Dispatch<TableContentProps[]>
}

const ActionsOption = ({ documentId, tableContents, setTableContents }:Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)

    const deleteDocument = () => {
    //   deleteDocumentById(documentId).then().catch()
    //   const newContents = tableContents.filter(item => item.id !== documentId)
    //   setTableContents(newContents)
    }

  return (
    <>
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteDocument}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
            <Button size={"sm"} variant={"ghost"} className='flex items-center gap-[3px] w-[25px] h-[25px] p-0'>
                <div className="rounded-full w-[3px] h-[3px] bg-black"></div>
                <div className="rounded-full w-[3px] h-[3px] bg-black"></div>
                <div className="rounded-full w-[3px] h-[3px] bg-black"></div>
            </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0 w-32 right-0' align='end'>
            <div className='p-1'>
                <Button size={"sm"} className='w-full text-xs h-7 rounded justify-start font-normal' variant={"ghost"}>Edit </Button>
                <Link href={`/api/document?id=${documentId}`}>
                  <Button size={"sm"} className='w-full text-xs h-7 rounded justify-between font-normal' variant={"ghost"}>Download <MdOutlineFileDownload className='text-muted-foreground' size={13}/> </Button>
                </Link>
                <Separator className='my-1'/>
                <Button size={"sm"} className='w-full text-red-500 hover:text-red-500 text-xs h-7 rounded justify-between font-normal' variant={"ghost"} onClick={() => setIsAlertOpen(true)}>Delete <FiDelete size={13}/></Button>
            </div>
        </PopoverContent>
    </Popover>
    </>
  )
}

export default ActionsOption