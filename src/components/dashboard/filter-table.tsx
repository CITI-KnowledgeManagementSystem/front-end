import React, { useEffect, useState } from 'react'
import { BsTags } from "react-icons/bs"
import { MdOutlineClear } from "react-icons/md";
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import CommandOption from './command-option'
import UploadCard from './upload-card'
import { OptionProps } from '@/types'

// APIS
import { accumulatedSizeOfDocuments } from '@/lib/queries'

const dummyTags = [
    { value: 'pdf' }, { value: 'txt' }, { value: 'md' },
]

const FilterTable = () => {
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState<OptionProps[]>([])
  const [storageSize, setStorageSize] = useState<number>(0)
  const [limitStorageSize, setLimitStorageSize] = useState<number>(25)
  const [searchTerm, setSearchTerm] = useState<string>("")


  const chooseTag = (newTag:OptionProps) => {
    const tagIndex = tags.indexOf(newTag)
    let newTags:OptionProps[]

    if (tagIndex === -1) {
      newTags = [...tags, newTag]
      setTags(newTags)
    } else {
      newTags = tags.filter((_, index) => index !== tagIndex)
      setTags(newTags)
    }
  }

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value
    setSearchTerm(newSearchTerm)
  }

  const clearTags = () => {
    setTags([])
  }

  useEffect(() => {
    accumulatedSizeOfDocuments(1).then(res => setStorageSize(res || 0)).catch(err => console.log(err)
    )
  }, [])

  return (
    <div className="flex items-center mb-5 justify-between">
        <div className='flex items-center'>
          <Input value={searchTerm} onChange={onSearchChange} placeholder='Search a title or a topic...' className='h-8 md:w-64'/>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className='border border-dashed'>
              <Button variant="ghost" role='combobox' className='h-8 text-xs mx-3 shadow border border-dashed'>
                <BsTags size={12} className='mr-2'/>Tags
                {tags.length !== 0 && <div className="flex items-center overflow-auto border-l ml-3 pl-2">
                    { tags.length < 3 ? tags.map((tag) => (
                        <Badge variant={"secondary"} className='mx-1 rounded font-light' key={tag.value}>{ tag.value }</Badge>
                    )) : <Badge variant={"secondary"} className='mx-1 rounded font-light'>{ tags.length } tags selected</Badge>}
                </div>}
              </Button>
            </PopoverTrigger>
            { tags.length !== 0 && <Button onClick={clearTags} size={"sm"} variant={"ghost"} className='h-8 text-xs items-center mr-3'>Clear <MdOutlineClear size={12} className='ml-2'/></Button> }
            <PopoverContent className="w-[200px] p-0" align='start'>
              <CommandOption placeholder='Search tags...' options={dummyTags} selectedOptions={tags} onClickItems={chooseTag} type='checkbox'/>
            </PopoverContent>
         </Popover>
         <UploadCard/>
        </div>
        <div className="flex flex-col text-xs items-center text-muted-foreground gap-y-2 font-medium">
            <Progress value={storageSize} max={limitStorageSize} indicatorColor='bg-blue-700' className='w-48'/>
            Storage { storageSize } GB of { limitStorageSize } GB used
        </div>
      </div>
  )
}

export default FilterTable