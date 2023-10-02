import React from 'react'
import Sidebar from './Sidebar'

type Props = {
  children: React.ReactNode,
}

function DashboardLayout({ children }: Props) {
  return (
    <div className='flex flex-row max-h-[100vh] max-w-[100vw] overflow-hidden'>
      <Sidebar />
      {children}
    </div>
  )
}

export default DashboardLayout