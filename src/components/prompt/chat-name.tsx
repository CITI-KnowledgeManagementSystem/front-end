import React, { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { FaCheck } from "react-icons/fa";
import useClickOutside from '@/lib/useClickOutside'
import ThreeDotSidebar from './three-dot-sidebar'


type Props = {
    id: string,
    name: string
}

const ChatName = ({ id, name } : Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const idOnPath = pathname?.split('/')[2]

    const [chatName, setChatName] = useState<string>(name)
    const [inputName, setInputName] = useState<string>(name)
    const [isRenaming, setIsRenaming] = useState<boolean>(false)
    const targetRef = useRef<HTMLDivElement>(null);

    const navigateToChat = () => {
        router.push(`/prompt/${id}`)
    }

    const updateChatName = async () => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', inputName);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/chatbox`, {
                method: 'PUT',
                body: formData,
            });
            setChatName(inputName)
            setIsRenaming(false)
        }
        catch (error) {
            console.error('Error:', error);
        }
        return void 0;
    }

    useClickOutside(targetRef, () => setIsRenaming(false))
    useEffect(() => setChatName(name), [name])

  return (
    <>
        {!isRenaming ? 
        <Button onClick={navigateToChat} variant={"ghost"} className={`my-1.5 flex justify-between items-center w-full relative group ${id === idOnPath && 'bg-white hover:bg-white'}`}>
            { chatName }
            <ThreeDotSidebar id={id} enableRename={() => setIsRenaming(true)}/>
        </Button> :
        <div className={`my-1.5 rounded-md w-full px-0.5 flex items-center gap-x-2`} ref={targetRef}>
            <Input defaultValue={chatName} className={`border-none w-full font-medium bg-white`} onChange={(e) => setInputName(e.target.value)}/>
            <Button className='bg-blue-700 py-0' size={"sm"} onClick={updateChatName}>
                <FaCheck/>
            </Button>
        </div>
        }
    </>
  )
}

export default ChatName