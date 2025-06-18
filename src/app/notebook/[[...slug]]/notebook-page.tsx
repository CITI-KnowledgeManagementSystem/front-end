"use client"

import { useState, useEffect } from 'react'
import { SourcesPanel } from '@/components/notebook/SourcesPanel'
import { ChatPanel } from '@/components/notebook/ChatPanel'
import { StudioPanel } from '@/components/notebook/StudioPanel'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Play, Settings, Share, PanelLeftClose, PanelRightClose } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { useNotebookAPI, Document } from '@/lib/api'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  img_url: string
}

interface NotebookPageProps {
  user: User | null
  mode: string
  notebookId: string | null
  token: string | null
}

const NotebookPage = ({ user, mode, notebookId, token }: NotebookPageProps) => {
  const { api } = useNotebookAPI()
  
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [sources, setSources] = useState<Document[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [isLoadingSources, setIsLoadingSources] = useState(false)
  const [currentChatBoxId, setCurrentChatBoxId] = useState<string>(notebookId || '')

  // Load user's documents when component mounts
  useEffect(() => {
    if (user?.id) {
      loadUserDocuments()
    }
  }, [user?.id])

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user...</p>
        </div>
      </div>
    )
  }

  // Handle different modes
  useEffect(() => {
    if (mode === 'session' && notebookId) {
      setCurrentChatBoxId(notebookId)
    } else if (mode === 'document' && notebookId) {
      // Auto-select a specific document if navigating to /notebook/document/123
      setSelectedSources([notebookId])
    }
  }, [mode, notebookId])

  const loadUserDocuments = async () => {
    if (!user?.id) return
    
    try {
      setIsLoadingSources(true)
      const response = await api.getDocuments({ userId: user.id, page: 0, n: 100 })
      setSources(response.data || [])
    } catch (error) {
      console.error('Failed to load documents:', error)
      toast.error('Failed to load your documents')
    } finally {
      setIsLoadingSources(false)
    }
  }

  const handleSourceSelection = (sourceIds: string[]) => {
    setSelectedSources(sourceIds)
  }

  const handleDocumentUpload = async (file: File, title: string, topic: string) => {
    if (!user?.id) {
      toast.error('Please sign in to upload documents')
      return
    }

    try {
      await api.uploadDocument({
        file,
        title,
        topic,
        user_id: user.id,
      })
      toast.success('Document uploaded successfully')
      // Reload documents
      await loadUserDocuments()
    } catch (error) {
      console.error('Failed to upload document:', error)
      toast.error('Failed to upload document')
    }
  }

  const handleDocumentDelete = async (documentId: string) => {
    try {
      await api.deleteDocument(documentId)
      toast.success('Document deleted successfully')
      // Remove from sources and selected sources
      setSources(prev => prev.filter(doc => doc.id !== documentId))
      setSelectedSources(prev => prev.filter(id => id !== documentId))
    } catch (error) {
      console.error('Failed to delete document:', error)
      toast.error('Failed to delete document')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Citi Knowledge Management System
            </h1>
            {mode !== 'default' && (
              <span className="text-sm text-gray-500 capitalize">
                • {mode} {notebookId ? `#${notebookId}` : ''}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            <PanelRightClose className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Share className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Settings className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <UserButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sources Panel */}
        {leftPanelOpen && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <SourcesPanel 
              sources={sources}
              selectedSources={selectedSources}
              onSourceSelection={handleSourceSelection}
              onDocumentUpload={handleDocumentUpload}
              onDocumentDelete={handleDocumentDelete}
              isLoading={isLoadingSources}
            />
          </div>
        )}

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col">
          <ChatPanel 
            sources={sources}
            selectedSources={selectedSources}
            currentChatBoxId={currentChatBoxId}
            onChatBoxCreate={setCurrentChatBoxId}
          />
        </div>

        {/* Studio Panel */}
        {rightPanelOpen && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <StudioPanel selectedSources={selectedSources} />
          </div>
        )}
      </div>
    </div>
  )
}

export default NotebookPage 