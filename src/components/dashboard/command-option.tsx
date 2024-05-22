import React, { useState } from 'react'
import { IoSearchOutline } from "react-icons/io5"
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Badge } from '../ui/badge'


type Props =  {
    placeholder?: string,
    options: string[],
    selectedOptions?: string[],
    type: "select" | "checkbox",
    onClickItems: (option: string) => void,
    clearTags: () => void,
    applyTags: () => void
}

const CommandOption = ({ placeholder, options, onClickItems, clearTags, applyTags, selectedOptions, type } : Props) => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [compOptions, setCompOptions] = useState(options)

    const filterOptions = (newSearchTerm:string) => {
        setSearchTerm(newSearchTerm)
        const newOps = options.filter(option => (option.startsWith(newSearchTerm) || !newSearchTerm))
        setCompOptions(newOps);
    }
    

  return (
    <div className='flex flex-col bg-white'>
        {placeholder && <div className="flex items-center py-2 px-3 text-sm border-b">
            <IoSearchOutline size={16} className='mr-2'/>
            <input type="text" value={searchTerm} onChange={(e) => filterOptions(e.target.value)} placeholder={placeholder} className='outline-none w-full'/>
        </div>}
        { compOptions.length !== 0 ?
        (<div className="flex flex-col p-1">
            {compOptions.map((option) => (
                <Button asChild onClick={()=>onClickItems(option)} key={option} variant={"ghost"} size={"sm"} className='justify-start items-center'>
                    <div className='flex items-center'>
                        {type === "checkbox" && <Checkbox className='mr-2' checked={selectedOptions?.indexOf(option) !== -1}/>}
                        <span>{ option }</span>
                        <span>{selectedOptions?.indexOf(option) !== -1}</span>
                    </div>
                </Button>
            ))}
        </div>) : <p className="text-xs text-muted-foreground py-2 px-3">No results found</p> }
        <div className="flex items-center justify-between p-2">
            <Badge variant={"outline"} className='px-3 hover:bg-slate-100 cursor-pointer' onClick={clearTags}>Reset</Badge>
            <Badge className='bg-blue-700 px-3 hover:bg-slate-700 cursor-pointer' onClick={applyTags}>Apply</Badge>
        </div>
    </div>
  )
}

export default CommandOption