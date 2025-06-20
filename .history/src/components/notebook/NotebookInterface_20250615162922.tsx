"use client"

import { useState, useEffect } from 'react'
import { SourcesPanel } from './SourcesPanel'
import { ChatPanel } from './ChatPanel'
import { StudioPanel } from './StudioPanel'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Play, Settings, Share, PanelLeftClose, PanelRightClose, User } from 'lucide-react'
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs'
import { useNotebookAPI, Document } from '@/lib/api'
import { toast } from 'sonner'

export function NotebookInterface() {
  const { isSignedIn, userId, isLoaded } = useAuth()
  const { api } = useNotebookAPI()
  
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [sources, setSources] = useState<Document[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [isLoadingSources, setIsLoadingSources] = useState(false)
  const [currentChatBoxId, setCurrentChatBoxId] = useState<string>('')

  // Load user's documents when authenticated
  useEffect(() => {
    if (isSignedIn && userId && isLoaded) {
      loadUserDocuments()
    }
  }, [isSignedIn, userId, isLoaded])

  const loadUserDocuments = async () => {
    if (!userId) return
    
    try {
      setIsLoadingSources(true)
      const response = await api.getDocuments({ userId, page: 0, n: 100 })
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
    if (!userId) {
      toast.error('Please sign in to upload documents')
      return
    }

    try {
      await api.uploadDocument({
        file,
        title,
        topic,
        user_id: userId,
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

  // Show sign-in prompt if not authenticated
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Play className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Citi Knowledge Management
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to access your documents and start chatting with your knowledge base.
          </p>
          <SignInButton>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              <User className="w-4 h-4 mr-2" />
              Sign In to Continue
            </Button>
          </SignInButton>
        </div>
      </div>
    )
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