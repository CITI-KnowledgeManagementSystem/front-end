"use client"
import { notFound, useParams } from 'next/navigation'
import React from 'react'
import DocumentPage from './document-page'

const DashboardPage = () => {
  const params = useParams()

  if (params.pageName === 'my-documents') {
    return <DocumentPage/>
  }
  return (
    notFound()
  )
}

export default DashboardPage