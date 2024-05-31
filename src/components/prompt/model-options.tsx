import React, { useState } from 'react'
import { FaMagento } from "react-icons/fa"
import { IoIosArrowDropdown } from "react-icons/io"
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Button } from '../ui/button'
import { llmModels } from '@/constants'

interface Props {
    selectedModel: string,
    setSelectedModel: (value: string) => void
}


const ModelOptions = ({ selectedModel, setSelectedModel }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleClickItem = (value: string) => {
        setSelectedModel(value)
        setIsOpen(false)
    }
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
            <Button variant={"ghost"} className='text-lg font-normal text-slate-700 bg-white'>
                <FaMagento size={18} className='mr-3'/>
                { selectedModel }
                <IoIosArrowDropdown className='ml-7' size={22}/>
            </Button>
        </PopoverTrigger>
        <PopoverContent align='end' className='p-1 max-w-48'>
            <div className="flex flex-col gap-y-1">
                { llmModels.map(item => (
                    <Button variant={"ghost"} className='justify-start font-normal' key={item.name} onClick={() => handleClickItem(item.name)}>
                        <FaMagento size={18} className='mr-3'/>
                        { item.name }
                    </Button>
                ))}
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default ModelOptions