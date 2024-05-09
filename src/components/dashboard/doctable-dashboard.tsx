"use client"
import React from 'react'
import PaginationTable from './pagination-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'
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

const dummyContents = [
    {
        id:'1',
        user_id:'21',
        title: 'Aku ganteng',
        created_at: '11-11-2001',
        size: '25 MB',
        tag: 'pdf',
        topic: 'Machine learning'
    },
    {
        id:'1',
        user_id:'21',
        title: 'Aku ganteng',
        created_at: '11-11-2001',
        size: '25 MB',
        tag: 'pdf',
        topic: 'Machine learning'
    },
    {
        id:'1',
        user_id:'21',
        title: 'Aku ganteng',
        created_at: '11-11-2001',
        size: '25 MB',
        tag: 'md',
        topic: 'Machine learning'
    },

]

const DocTable = () => {
    const [tableContents, setTableContents] = useState<TableContentProps[]>(dummyContents)
    const [selectedItems, setSelectedItems] = useState<TableContentProps[]>([])

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


  return (
    <>
        <FilterTable/>
        <ScrollArea className='max-h-3/5 rounded-md border'>
            <Table>
                <TableHeader className='sticky w-full top-0 bg-white'>
                    <TableRow className='text-xs'>
                        <TableHead className='flex items-center'>
                            <Checkbox checked={selectedItems.length === tableContents.length} onClick={selectAllContents} className='mr-3'/>
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
                            <TableCell><Badge>{ item.tag }</Badge></TableCell>
                            <TableCell>{ item.topic }</TableCell>
                            <TableCell>{ item.size } MB</TableCell>
                            <TableCell>{ item.created_at }</TableCell>
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
        </ScrollArea>
        <PaginationTable selectedItems={selectedItems} tableContents={tableContents}/>
    </>
  )
}

export default DocTable