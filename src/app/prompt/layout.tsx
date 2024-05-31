import React from 'react'
import SidebarPrompt from '@/components/prompt/sidebar-prompt'

const PromptLayout = ({ children }:{ children:React.ReactNode }) => {
  return (
    <div className='flex h-screen w-full justify-center items-center'>
        <SidebarPrompt/>
        { children }
    </div>
  )
}

export default PromptLayout