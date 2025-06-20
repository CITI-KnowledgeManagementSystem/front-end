"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, FileText, X, MoreVertical, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Source {
  id: string
  title: string
  type: string
  size: string
  pages?: number
  selected: boolean
}

interface SourcesPanelProps {
  sources: Source[]
  setSources: (sources: Source[]) => void
}

export function SourcesPanel({ sources, setSources }: SourcesPanelProps) {
  const [dragOver, setDragOver] = useState(false)

  const toggleSourceSelection = (id: string) => {
    setSources(sources.map(source => 
      source.id === id ? { ...source, selected: !source.selected } : source
    ))
  }

  const removeSource = (id: string) => {
    setSources(sources.filter(source => source.id !== id))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    // Handle file drop logic here
    console.log('Files dropped:', e.dataTransfer.files)
  }

  const selectedCount = sources.filter(s => s.selected).length

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Sources</h2>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Select all sources</span>
          <Checkbox 
            checked={selectedCount === sources.length && sources.length > 0}
            onCheckedChange={(checked) => {
              setSources(sources.map(source => ({ ...source, selected: !!checked })))
            }}
          />
        </div>
      </div>

      {/* Sources List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {sources.map((source) => (
            <div
              key={source.id}
              className={`p-3 rounded-lg border transition-colors ${
                source.selected 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    checked={source.selected}
                    onCheckedChange={() => toggleSourceSelection(source.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <Badge variant="secondary" className="text-xs">
                        {source.type.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {source.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{source.size}</span>
                      {source.pages && (
                        <>
                          <span>•</span>
                          <span>{source.pages} pages</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => removeSource(source.id)}>
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Upload Area */}
      <div className="p-4 border-t border-gray-200">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or click to browse
          </p>
          <Button variant="outline" size="sm">
            Choose files
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Supports PDF, DOC, TXT, and more
          </p>
        </div>
      </div>
    </div>
  )
} 