"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  Download, 
  BookOpen, 
  Brain, 
  Clock, 
  FileText, 
  Headphones,
  Plus,
  MoreVertical,
  CheckCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface StudyTool {
  id: string
  type: 'audio-overview' | 'study-guide' | 'timeline' | 'faq' | 'briefing-doc'
  title: string
  description: string
  status: 'ready' | 'generating' | 'error'
  duration?: string
  progress?: number
}

export function StudioPanel() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(35)
  const [studyTools, setStudyTools] = useState<StudyTool[]>([
    {
      id: '1',
      type: 'audio-overview',
      title: 'Audio Overview',
      description: 'Click to load the conversation.',
      status: 'ready',
      duration: '2 sources'
    },
    {
      id: '2',
      type: 'study-guide',
      title: 'LongLoRA Study Guide',
      description: 'Study guide and glossary',
      status: 'ready'
    },
    {
      id: '3',
      type: 'timeline',
      title: 'Timeline',
      description: 'Chronological overview of key events',
      status: 'generating',
      progress: 65
    },
    {
      id: '4',
      type: 'briefing-doc',
      title: 'Briefing doc',
      description: 'Executive summary document',
      status: 'ready'
    }
  ])

  const getToolIcon = (type: StudyTool['type']) => {
    switch (type) {
      case 'audio-overview':
        return <Headphones className="w-5 h-5" />
      case 'study-guide':
        return <BookOpen className="w-5 h-5" />
      case 'timeline':
        return <Clock className="w-5 h-5" />
      case 'faq':
        return <Brain className="w-5 h-5" />
      case 'briefing-doc':
        return <FileText className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getStatusBadge = (status: StudyTool['status']) => {
    switch (status) {
      case 'ready':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Ready</Badge>
      case 'generating':
        return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">Generating...</Badge>
      case 'error':
        return <Badge variant="destructive" className="text-xs">Error</Badge>
      default:
        return null
    }
  }

  const generateNewTool = (type: StudyTool['type']) => {
    const newTool: StudyTool = {
      id: Date.now().toString(),
      type,
      title: type === 'faq' ? 'FAQ' : type.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      description: 'Generating from selected sources...',
      status: 'generating',
      progress: 0
    }

    setStudyTools([...studyTools, newTool])

    // Simulate generation progress
    const interval = setInterval(() => {
      setStudyTools(tools => tools.map(tool => {
        if (tool.id === newTool.id && tool.status === 'generating') {
          const newProgress = (tool.progress || 0) + Math.random() * 15
          if (newProgress >= 100) {
            clearInterval(interval)
            return { ...tool, status: 'ready', progress: 100, description: 'Ready to view' }
          }
          return { ...tool, progress: newProgress }
        }
        return tool
      }))
    }, 500)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Studio</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => generateNewTool('audio-overview')}>
                <Headphones className="w-4 h-4 mr-2" />
                Audio Overview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generateNewTool('study-guide')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Study Guide
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generateNewTool('timeline')}>
                <Clock className="w-4 h-4 mr-2" />
                Timeline
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generateNewTool('faq')}>
                <Brain className="w-4 h-4 mr-2" />
                FAQ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generateNewTool('briefing-doc')}>
                <FileText className="w-4 h-4 mr-2" />
                Briefing Doc
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Audio Overview Section */}
      <div className="p-4 border-b border-gray-200 bg-orange-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Audio Overview</h3>
            <p className="text-sm text-gray-600">Create an Audio Overview in more languages!</p>
          </div>
        </div>
        
        <Button className="w-full mb-3 bg-orange-500 hover:bg-orange-600 text-white">
          <Play className="w-4 h-4 mr-2" />
          Generate Audio Overview
        </Button>
        
        {/* Audio Player (when generated) */}
        <div className="bg-white rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">LongLoRA Overview</span>
            <span className="text-xs text-gray-500">5:42 / 8:30</span>
          </div>
          
          <Progress value={audioProgress} className="mb-3" />
          
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="ghost">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Notes</h3>
          <Button size="sm" variant="ghost">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-500 italic">
          Click to load the conversation.
        </p>
      </div>

      {/* Study Tools */}
      <div className="flex-1">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {studyTools.map((tool) => (
              <div
                key={tool.id}
                className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-gray-600">
                      {getToolIcon(tool.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {tool.title}
                        </h4>
                        {getStatusBadge(tool.status)}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {tool.description}
                      </p>
                      {tool.duration && (
                        <p className="text-xs text-gray-500 mt-1">
                          {tool.duration}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {tool.status === 'generating' && tool.progress !== undefined && (
                  <div className="space-y-1">
                    <Progress value={tool.progress} className="h-1" />
                    <p className="text-xs text-gray-500">
                      {Math.round(tool.progress)}% complete
                    </p>
                  </div>
                )}
                
                {tool.status === 'ready' && (
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Ready to use</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
} 