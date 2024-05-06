import React from 'react'
import SidebarPrompt from '@/components/sidebar-prompt'

const PromptLayout = ({ children }:{ children:React.ReactNode }) => {
  return (
    <div className='flex h-screen'>
        <SidebarPrompt/>
        { children }
    </div>
  )
}

export default PromptLayout