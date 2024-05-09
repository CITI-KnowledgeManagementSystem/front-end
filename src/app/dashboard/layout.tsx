import React from 'react'
import SidebarDashboard from '@/components/dashboard/sidebar-dashboard'


const DashboardLayout = ({ children }:{ children:React.ReactNode }) => {
  return (
    <div className='flex items-center h-screen'>
        <SidebarDashboard/>
        { children }
    </div>
  )
}

export default DashboardLayout