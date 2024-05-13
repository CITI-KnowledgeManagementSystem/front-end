import React from 'react'
import SidebarPrompt from '@/components/sidebar-prompt'
import { auth } from "@clerk/nextjs/server"

const PromptLayout = ({ children }:{ children:React.ReactNode }) => {
  const { userId } = auth()
  return (
    <div className='flex h-full w-full justify-center items-center'>
        <SidebarPrompt userId={ userId }/>
        { children }
    </div>
  )
}

export default PromptLayout