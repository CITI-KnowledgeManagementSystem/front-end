"use client"
import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ChatBox from '@/components/chat-box'

const dummyChats = [
    {
        type: "request",
        message: "How to find a purpose in this life?"
    },
    {
        type: "response",
        message: "Life is nice broo, just relax and sip your coffee..."
    },
]


const PromptPage = () => {
    const [data, setData] = useState(dummyChats)
    const [prompt, setPrompt] = useState<string>("")

    const handleSendPrompt = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        const newMessage = {
            type: "request",
            message: prompt
        }
        const newData = [...data, newMessage]
        setData(newData)
        handleGetResponse().then(res => setData([...newData, res]))
        setPrompt("")
    }

    const handleGetResponse = async () => {
        // async
        const newResponse = {
            type: "response",
            message: "It's okayy, just chill my brother"
        }
        return newResponse      
    }

  return (
    <div className='flex flex-col w-full justify-end p-5 h-screen'>
        <div className="w-full flex-1 overflow-y-auto p-5">
            <div className="flex flex-col justify-end items-center h-full">
                { data.map((item, i) => (
                    <ChatBox variant={item.type} message={item.message} key={i}/>
                )) }
            </div>
        </div>
        <form action="submit" onSubmit={handleSendPrompt} className='flex items-center gap-x-4'>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder='Enter a prompt...' className='resize-none'/>
            <Button>Send</Button>
        </form>
    </div>
  )
}

export default PromptPage