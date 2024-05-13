import React from 'react'
import SidebarPrompt from '@/components/sidebar-prompt'

const PromptLayout = ({ children }:{ children:React.ReactNode }) => {
  return (
    <div className='flex h-full w-full justify-center items-center'>
        {/* <SidebarPrompt/> */}
        { children }
    </div>
  )
}

export default PromptLayout