import React from 'react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'
import { TableContentProps } from '@/types'
import { rowsPerPageValues } from '@/constants'
import { BsChevronExpand, BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { useRouter } from 'next/navigation'

type Props = {
    selectedItems: TableContentProps[],
    tableContents: TableContentProps[],
    rowsPerPage: number,
    paginationIndex: number,
    totalItems: number

}

const PaginationTable = ({ selectedItems, tableContents, rowsPerPage, paginationIndex, totalItems }: Props) => {
    const router = useRouter()
  return (
    <div className="Pagination flex items-center justify-between mt-5">
        <p className="text-muted-foreground text-sm">{ selectedItems.length } of { tableContents.length } row(s) selected</p>
        <div className="flex items-center">
            <div className="font-medium text-sm mr-7">
                Rows per page
                <DropdownMenu>
                    <DropdownMenuContent className='outline-none'>
                        { rowsPerPageValues.map(val => (
                            <DropdownMenuItem key={val} onClick={() => router.push(`?page=${0}&n=${val}`)}>{ val }</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                    <DropdownMenuTrigger asChild className='outline-none w-fit ml-3'>
                        <Button size={"sm"} variant={"outline"}>{ rowsPerPage } <BsChevronExpand size={16} className='ml-3'/></Button>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </div>
            <p className="font-medium text-sm mr-7">Page { paginationIndex } of { Math.ceil((totalItems/rowsPerPage) - 1) }</p>
            <Button onClick={() => router.push(`?page=0&n=${rowsPerPage}`)} variant={"outline"} disabled={paginationIndex === 0} size={"sm"} className='mx-1 px-2 shadow'>
                <BsChevronLeft size={16}/>
            </Button>
            <Button onClick={() => router.push(`?page=${paginationIndex - 1}&n=${rowsPerPage}`)} variant={"outline"} disabled={paginationIndex === 0} size={"sm"} className='mx-1 px-2 shadow'>
                <BsChevronLeft size={16}/>
            </Button>
            <Button onClick={() => router.push(`?page=${paginationIndex + 1}&n=${rowsPerPage}`)} variant={"outline"} disabled={Math.ceil(totalItems / rowsPerPage) === paginationIndex + 1} size={"sm"} className='mx-1 px-2 shadow'>
                <BsChevronRight size={16}/>
            </Button>
            <Button onClick={() => router.push(`?page=${Math.ceil((totalItems/rowsPerPage) - 1)}&n=${rowsPerPage}`)} variant={"outline"} disabled={Math.ceil(totalItems / rowsPerPage) === paginationIndex + 1} size={"sm"} className='mx-1 px-2 shadow'>
                <BsChevronRight size={16}/>
            </Button>
        </div>
    </div>
  )
}

export default PaginationTable