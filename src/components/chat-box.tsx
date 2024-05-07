import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'


interface Props {
    variant: string,
    message: string
}

const ChatBox = ({ variant, message }: Props) => {
   
    if(variant === "request"){
        return (
            <div className="w-3/5">
                <div className="flex items-center gap-x-2">
                    <Avatar className='w-6 h-6 rounded-full overflow-hidden'>
                        <AvatarImage className='object-cover' src='https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'/>
                        <AvatarFallback className='text-xs'>RT</AvatarFallback>
                    </Avatar>
                    <h2 className="text-sm font-medium">User</h2>
                </div>
                <p className='text-sm bg-blue-700 rounded-lg py-2 px-4 text-white mt-2 mb-4'>
                    { message }
                </p>
            </div>
        )
    }

  return (
    <div className="w-3/5 my-1">
        <div className="flex items-center gap-x-2">
            <Avatar className='w-6 h-6 rounded-full overflow-hidden'>
                <AvatarImage className='object-cover' src='./taiwan-tech.png'/>
                <AvatarFallback className='text-xs'>TW</AvatarFallback>
            </Avatar>
            <h2 className="text-sm font-medium">Ai Llama 2</h2>
        </div>
        <p className='text-sm mt-2 mb-4'>
            { message }
        </p>
    </div>
  )
}

export default ChatBox