import React, { useState } from 'react'
import { IoSearchOutline } from "react-icons/io5"
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { OptionProps } from '@/types'


type Props =  {
    placeholder?: string,
    options: OptionProps[],
    selectedOptions?: OptionProps[],
    type: "select" | "checkbox",
    onClickItems: (option: OptionProps) => void
}

const CommandOption = ({ placeholder, options, onClickItems, selectedOptions, type } : Props) => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [compOptions, setCompOptions] = useState(options)

    const filterOptions = (newSearchTerm:string) => {
        setSearchTerm(newSearchTerm)
        const newOps = options.filter(option => (option.value.startsWith(newSearchTerm) || !newSearchTerm))
        setCompOptions(newOps);
    }
  return (
    <div className='flex flex-col'>
        {placeholder && <div className="flex items-center py-2 px-3 text-sm border-b">
            <IoSearchOutline size={16} className='mr-2'/>
            <input type="text" value={searchTerm} onChange={(e) => filterOptions(e.target.value)} placeholder={placeholder} className='outline-none w-full'/>
        </div>}
        { compOptions.length !== 0 ?
        (<div className="flex flex-col p-1">
            {compOptions.map((option) => (
                <Button onClick={()=>onClickItems(option)} key={option.value} variant={"ghost"} size={"sm"} className='justify-start items-center'>
                    {type === "checkbox" && <Checkbox className='mr-2' checked={selectedOptions?.indexOf(option) !== -1}/>}
                    <span>{ option.value }</span>
                </Button>
            ))}
        </div>) : <p className="text-xs text-muted-foreground py-2 px-3">No results found</p> }
    </div>
  )
}

export default CommandOption