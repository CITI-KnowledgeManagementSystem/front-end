import React from 'react'

const AuthLayout = ({ children }:{ children:React.ReactNode }) => {
  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center bg-slate-200'>
        { children }
    </div>
  )
}

export default AuthLayout