"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bookmark, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Source {
  id: string
  title: string
  type: string
  size: string
  pages?: number
  selected: boolean
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: string[]
}

interface ChatPanelProps {
  sources: Source[]
}

export function ChatPanel({ sources }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "This paper introduces LongLoRA, an efficient method for fine-tuning large language models (LLMs) to handle significantly longer contexts than their initial training. The key components enable LLMs to be extended to context lengths up to 100k tokens with considerably less computational resources and time compared to full fine-tuning, while retaining compatibility with existing inference optimizations.\n\nExperimental results demonstrate its effectiveness in language modeling and retrieval tasks across different LLM sizes. The method includes a self-collected dataset, LongAlpaca, for supervised fine-tuning with long instructions.",
      timestamp: new Date(),
      sources: ['1']
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const selectedSources = sources.filter(s => s.selected)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages([...messages, newMessage])
    setInputValue('')
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I understand you're asking about the content from your selected sources. Let me analyze the information and provide you with a comprehensive answer based on the documents you've uploaded.",
        timestamp: new Date(),
        sources: selectedSources.map(s => s.id)
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
          <div className="flex items-center gap-2">
            {selectedSources.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''} selected
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {message.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 max-w-lg">
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-2xl p-4 max-w-4xl">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>Sources:</span>
                          {message.sources.map(sourceId => {
                            const source = sources.find(s => s.id === sourceId)
                            return source ? (
                              <Badge key={sourceId} variant="secondary" className="text-xs">
                                {source.title.length > 30 
                                  ? source.title.substring(0, 30) + '...' 
                                  : source.title}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  <div className="flex items-center gap-2 pl-4">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-gray-700">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-gray-700">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-gray-700">
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          {selectedSources.length === 0 && (
            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Select sources from the sidebar to start asking questions about your documents.
              </p>
            </div>
          )}
          
          <div className="relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                selectedSources.length > 0 
                  ? "Ask questions about your selected sources..." 
                  : "Select sources to start chatting..."
              }
              className="min-h-[60px] pr-12 resize-none"
              disabled={selectedSources.length === 0}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || selectedSources.length === 0}
              size="sm"
              className="absolute right-2 bottom-2 h-8 w-8 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>
              {selectedSources.length > 0 
                ? `Ready to answer questions from ${selectedSources.length} selected source${selectedSources.length !== 1 ? 's' : ''}`
                : 'Select sources to enable chat'
              }
            </span>
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  )
} 