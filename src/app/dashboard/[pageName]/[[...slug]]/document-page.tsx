import React from 'react'
import DocTable from '@/components/dashboard/doctable-dashboard'
const DocumentPage = () => {
  return (
    <div className='bg-white w-full h-full p-10'>
        <div className="bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
            <h1 className='text-3xl font-bold'>Welcome, Rainata!</h1>
            <p className="text-muted-foreground font-light">Manage your documents here</p>
        </div>
        <div className="flex flex-col my-4">
            <DocTable/>
        </div>
    </div>
  )
}

export default DocumentPage