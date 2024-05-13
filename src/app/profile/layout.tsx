import React from 'react'

const PromptLayout = ({ children }:{ children:React.ReactNode }) => {
  return (
    <div className='flex h-full w-full justify-center items-center'>
        { children }
    </div>
  )
}

export default PromptLayout