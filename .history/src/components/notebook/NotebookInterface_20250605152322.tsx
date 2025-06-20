"use client"

import { useState } from 'react'
import { SourcesPanel } from './SourcesPanel'
import { ChatPanel } from './ChatPanel'
import { StudioPanel } from './StudioPanel'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Play, Settings, Share, PanelLeftClose, PanelRightClose } from 'lucide-react'

export function NotebookInterface() {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [sources, setSources] = useState([
    {
      id: '1',
      title: 'LongLoRA: Efficient Fine-tuning for Long-Context Large Language Models',
      type: 'pdf',
      size: '2.3MB',
      pages: 12,
      selected: true
    }
  ])

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
              LongLoRA: Efficient Fine-tuning for Long-Context LLMs
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sources Panel */}
        {leftPanelOpen && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <SourcesPanel sources={sources} setSources={setSources} />
          </div>
        )}

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col">
          <ChatPanel sources={sources} />
        </div>

        {/* Studio Panel */}
        {rightPanelOpen && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <StudioPanel />
          </div>
        )}
      </div>
    </div>
  )
} 