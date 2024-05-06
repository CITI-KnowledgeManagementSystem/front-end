import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const PromptPage = () => {
  return (
    <div className='flex flex-col w-full justify-end p-5'>
        <div className="">
            Chat Contents
        </div>
        <form action="" className='flex items-center gap-x-4'>
            <Textarea placeholder='Enter a prompt...' className='resize-none'/>
            <Button size={"sm"}>Send</Button>
        </form>
    </div>
  )
}

export default PromptPage