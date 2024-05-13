"use client"
import React, { useEffect, useState } from 'react'
import PaginationTable from './pagination-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { BsChevronExpand } from "react-icons/bs"
import { FaRegFilePdf } from "react-icons/fa6"
import { SiObsidian } from "react-icons/si"
import { FiFileText } from "react-icons/fi"
import ActionsOption from './action-options'
import FilterTable from './filter-table'
import { TableContentProps } from '@/types'
import { useAuth } from "@clerk/nextjs"

const DocTable = () => {
    const [tableContents, setTableContents] = useState<TableContentProps[]>([])
    const [selectedItems, setSelectedItems] = useState<TableContentProps[]>([])
    const [error, setError] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { userId } = useAuth()

    const selectAllContents = () => {
        if (selectedItems.length === tableContents.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(tableContents)
        }
    }

    const selectContent = (content: TableContentProps) => {
        const elementIndex = selectedItems.indexOf(content)
        
        if (elementIndex === -1) {
            const newSelectedItems = [...selectedItems, content]
            setSelectedItems(newSelectedItems)
        } else {
            const newSelectedItems = selectedItems.filter((_, index) => index !== elementIndex)
            setSelectedItems(newSelectedItems)
        }
    }


    useEffect(() => {
        setIsLoading(true)
        fetch(`/api/documents?id=${userId}`).then(async (res) => {
            if (!res.ok) {
                setError("An error has occured when fetching the data")
            }
            const newData = await res.json()

            console.log(newData);
            
            
            setTableContents(newData.data)
            setIsLoading(false)
        })
    }, [])


    if (isLoading) {
        return (
            <div className="w-full h-full text-center">
                Fetching the data...
            </div>
        )
    }
  return (
    <>
        <FilterTable/>
        <div className="max-h-[calc(100%-136px)] relative overflow-auto border rounded-md">
            <Table>
                <TableHeader className='sticky w-full top-0 bg-white z-40'>
                    <TableRow className='text-xs'>
                        <TableHead className='flex items-center'>
                            <Checkbox checked={selectedItems.length === tableContents.length && tableContents.length !== 0} onClick={selectAllContents} className='mr-3'/>
                            <Button variant={"ghost"} size={"sm"} className='px-2'> 
                                <span className='text-xs'>Title</span>
                                <BsChevronExpand className='ml-2' size={12}/>
                            </Button>
                        </TableHead>
                        <TableHead>Tag</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>
                            <Button variant={"ghost"} size={"sm"} className='px-2'> 
                                <span className='text-xs'>Size</span>
                                <BsChevronExpand className='ml-2' size={12}/>
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant={"ghost"} size={"sm"} className='px-2'> 
                                <span className='text-xs'>Date Added</span>
                                <BsChevronExpand className='ml-2' size={12}/>
                            </Button>
                        </TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { tableContents.map((item, i) => (
                        <TableRow key={i}>
                            <TableCell className='flex font-medium items-center'>
                                <Checkbox key={i} onClick={() => selectContent(item)} checked={selectedItems?.indexOf(item) !== -1} className='mr-3'/>
                                { item.tag === 'pdf' ? <FaRegFilePdf size={16} className='mr-2'/> : item.tag === 'txt' ? <FiFileText size={16} className='mr-2'/> :  <SiObsidian size={16} className='mr-2'/>}
                                { item.title }
                            </TableCell>
                            <TableCell><Badge variant={"default"} className='bg-blue-700 border-none hover:bg-blue-700'>{ item.tag }</Badge></TableCell>
                            <TableCell>{ item.topic }</TableCell>
                            <TableCell>{ item.file_size_formatted }</TableCell>
                            <TableCell>{ item.createdAt }</TableCell>
                            <TableCell><ActionsOption documentId={item.id} tableContents={tableContents} setTableContents={setTableContents}/></TableCell>
                        </TableRow>
                    )) }
                    { tableContents.length === 0 && <TableRow>
                        <TableCell colSpan={5}>
                            <p className="text-muted-foreground text-sm italic flex justify-center">No documents found</p>
                        </TableCell>
                    </TableRow> }
                </TableBody>
            </Table>
        </div>
        <PaginationTable selectedItems={selectedItems} tableContents={tableContents}/>
        <p className="text-red-700 w-full text-center py-4 text-sm">{ error }</p>
    </>
  )
}

export default DocTable