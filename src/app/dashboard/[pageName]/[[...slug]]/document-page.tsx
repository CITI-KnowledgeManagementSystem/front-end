import React from 'react'
import DocTable from '@/components/dashboard/doctable-dashboard'
const DocumentPage = () => {
  return (
    <div className='bg-white w-full h-full p-7 flex flex-col'>
        <div className="p-3 bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
            <h1 className='text-3xl font-bold'>Welcome, Rainata!</h1>
            <p className="text-muted-foreground font-light">Manage your documents here</p>
        </div>
          <div className="flex-1 overflow-hidden py-5 px-3">
            <DocTable/>
          </div>
    </div>
  )
}

export default DocumentPage