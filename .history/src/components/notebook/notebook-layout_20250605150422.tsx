"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  MessageSquare, 
  Play, 
  Settings, 
  Plus,
  Search,
  Brain,
  Map,
  Timeline,
  BookOpen,
  Mic,
  Download,
  Share
} from "lucide-react";

interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'text' | 'webpage';
  size?: string;
}

interface NotebookLayoutProps {
  children?: React.ReactNode;
}

export default function NotebookLayout({ children }: NotebookLayoutProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [activePanel, setActivePanel] = useState<'sources' | 'chat' | 'studio'>('chat');

  // Mock data - replace with your actual data
  const sources: Source[] = [
    { id: '1', name: '2309.12307v3.pdf', type: 'pdf', size: '2.3MB' },
    { id: '2', name: 'LongLoRA: Efficient Fine-tuning of Long-Context Large Language Models', type: 'webpage' }
  ];

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Sources Panel */}
      <div className="w-80 notebook-panel flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sources</h2>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={selectedSources.length === sources.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedSources(sources.map(s => s.id));
                } else {
                  setSelectedSources([]);
                }
              }}
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-600">Select all sources</span>
          </div>

          <Button variant="outline" size="sm" className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Discover
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {sources.map((source) => (
              <div key={source.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSources.includes(source.id)}
                  onChange={() => toggleSource(source.id)}
                  className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {source.name}
                    </span>
                  </div>
                  {source.size && (
                    <span className="text-xs text-gray-500">{source.size}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-center px-6">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 ml-3">
              LongLoRA: Efficient Fine-tuning for Long-Context LLMs
            </h1>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col p-6">
          {children || (
            <div className="flex-1 flex flex-col">
              {/* Welcome Message */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Ask questions about your sources, request summaries, or explore insights.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                      Summarize key findings
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                      Compare approaches
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                      Find methodologies
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="mt-6">
                <div className="relative">
                  <textarea
                    placeholder="Start typing..."
                    className="notebook-input min-h-[60px]"
                    rows={3}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className="text-xs text-gray-400">2 sources</span>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Studio Panel */}
      <div className="w-80 notebook-panel flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Studio</h2>
          
          <div className="space-y-3">
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Audio Overview</span>
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                  BETA
                </Badge>
              </div>
              <p className="text-xs text-orange-700 mb-3">
                Click to load the conversation.
              </p>
              <Button size="sm" variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100">
                Load
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              <span className="text-xs font-medium text-gray-500 mb-2 block">Interactive mode</span>
              <Badge variant="secondary" className="text-xs">BETA</Badge>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Notes</h3>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Plus className="w-4 h-4 mr-2" />
            Add note
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                <BookOpen className="w-4 h-4 mr-2" />
                Study guide
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                <FileText className="w-4 h-4 mr-2" />
                FAQ
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                <Timeline className="w-4 h-4 mr-2" />
                Timeline
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                <Map className="w-4 h-4 mr-2" />
                Mind Map
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500 mb-2">
                LongLoRA Study Guide Quiz
              </div>
              <p className="text-xs text-gray-600">
                What is the primary challenge that LongLoRA aims to address? How does the computational cost of self-attention scale with increasing...
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Save to note
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 