import React from 'react'


interface Props {
    variant: string,
    message: string
}

const ChatBox = ({ variant, message }: Props) => {
   
    if(variant === "request"){
        return (
            <div className="w-3/5">
                <h2 className="text-sm font-medium">User</h2>
                <p className='text-sm bg-blue-700 rounded-lg py-2 px-4 text-white mt-2 mb-4'>
                    { message }
                </p>
            </div>
        )
    }

  return (
    <div className="w-3/5 my-1">
        <h2 className="text-sm font-medium">Ai Llama 2</h2>
        <p className='text-sm mt-2 mb-4'>
            { message }
        </p>
    </div>
  )
}

export default ChatBox