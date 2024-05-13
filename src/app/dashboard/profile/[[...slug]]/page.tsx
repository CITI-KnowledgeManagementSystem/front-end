"use client"
import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MessageProps } from '@/types'
import ChatBox from '@/components/chat-box'
import { answerQuestions } from '@/lib/utils'

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



// const PromptPage = () => {
//     const [data, setData] = useState<MessageProps[]>([])
//     const [prompt, setPrompt] = useState<string>("")

//     const handleSendPrompt = (e:React.ChangeEvent<HTMLFormElement>) => {
//         e.preventDefault()
//         const newMessage = {
//             type: "request",
//             message: prompt
//         }
//         const newData = [...data, newMessage]
//         setData(newData)
//         handleGetResponse().then(res => setData([...newData, res]))
//         setPrompt("")
//     }

//     const handleGetResponse = async () => {
//         const data = await answerQuestions(prompt);

//         // async
//         const newResponse = {
//             type: "response",
//             message: data
//         }
//         return newResponse      
//     }
      

//   return (
//     <div className='flex flex-col w-full p-5 h-screen'>
//         <div className="w-full flex-1 overflow-y-auto mb-5 py-5 px-[100px]">
//             {data.length === 0 && <div className="flex flex-col justify-center h-full max-w-[900px] m-auto">
//                 <div className="bg-gradient-to-r from-blue-500 to-teal-300 bg-clip-text text-transparent animate-slide-in delay-300">
//                     <h1 className='text-6xl font-medium'>Welcome, Rainata</h1>
//                 </div>
//                 <h1 className='text-6xl font-medium py-3 bg-gradient-to-r from-neutral-500 to-sky-700 bg-clip-text text-transparent animate-slide-in delay-300'>Ready to learn something new?</h1>
//             </div>}
//             <div className="flex flex-col m-auto max-w-[900px] pt-10">
//                 { data.map((item, i) => (
//                     <ChatBox variant={item.type} message={item.message} key={i}/>
//                 )) }
//             </div>
//         </div>
//         <div className="flex justify-center items-center">
//             <form action="submit" onSubmit={handleSendPrompt} className='flex w-full max-w-[900px] items-center gap-x-4'>
//                 <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder='Enter a prompt...' className='resize-none w-full'/>
//                 <Button disabled={prompt.length === 0}>Send</Button>
//             </form>
//         </div>
//     </div>
//   )
// }

// export default PromptPage

const ProfilePage = () => {
    return (
        <div className='flex flex-col w-full h-full p-7'>
            <div>
                <h1 className='bold text-3xl font-bold'>
                    Profile Page
                </h1>
            </div>
        </div>
    )
}

export default ProfilePage