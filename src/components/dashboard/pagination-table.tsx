import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'
import { TableContentProps } from '@/types'
import { rowsPerPageValues } from '@/constants'
import { BsChevronExpand, BsChevronLeft, BsChevronRight } from "react-icons/bs"

type Props = {
    selectedItems: TableContentProps[],
    tableContents: TableContentProps[],

}

const PaginationTable = ({ selectedItems, tableContents }: Props) => {
    const [rowsPerPage, setRowsPerPage] = useState<number>(10)
    const [paginationIndex, setPaginationIndex] = useState<number>(0)
  return (
    <div className="Pagination flex items-center justify-between mt-5">
        <p className="text-muted-foreground text-sm">{ selectedItems.length } of { tableContents.length } row(s) selected</p>
        <div className="flex items-center">
            <div className="font-medium text-sm mr-7">
                Rows per page
                <DropdownMenu>
                    <DropdownMenuContent className='outline-none'>
                        { rowsPerPageValues.map(val => (
                            <DropdownMenuItem key={val} onClick={() => setRowsPerPage(val)}>{ val }</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                    <DropdownMenuTrigger asChild className='outline-none w-fit ml-3'>
                        <Button size={"sm"} variant={"outline"}>{ rowsPerPage } <BsChevronExpand size={16} className='ml-3'/></Button>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </div>
            <p className="font-medium text-sm mr-7">Page { paginationIndex } of 10</p>
            <Button variant={"outline"} disabled={paginationIndex === 0} size={"sm"} className='mx-1 px-2 shadow'><Link href={`?page=${paginationIndex - 1}`}><BsChevronLeft size={16}/></Link></Button>
            <Button variant={"outline"} disabled={paginationIndex === 0} size={"sm"} className='mx-1 px-2 shadow'><Link href={``}><BsChevronLeft size={16}/></Link></Button>
            <Button variant={"outline"} disabled={Math.ceil(tableContents.length / rowsPerPage) === paginationIndex + 1} size={"sm"} className='mx-1 px-2 shadow'><Link href={'#'}><BsChevronRight size={16}/></Link></Button>
            <Button variant={"outline"} disabled={Math.ceil(tableContents.length / rowsPerPage) === paginationIndex + 1} size={"sm"} className='mx-1 px-2 shadow'><Link href={"#"}><BsChevronRight size={16}/></Link></Button>
        </div>
    </div>
  )
}

export default PaginationTable