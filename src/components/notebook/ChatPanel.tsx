"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bookmark, Copy, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@clerk/nextjs'
import { useNotebookAPI, Document, Message } from '@/lib/api'
import { getChatMessages } from '@/lib/utils'
import { MessageProps } from '@/types'
import { toast } from 'sonner'
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

import { Markmap } from 'markmap-view';
// import { transformer } from './markmap';
import { Toolbar } from 'markmap-toolbar';
import 'markmap-toolbar/dist/style.css';
import { Transformer } from 'markmap-lib';
import useMindMapStore from './markmap'
import { set } from 'react-hook-form'

interface ChatPanelProps {
  sources: Document[]
  selectedSources: string[]
  currentChatBoxId: string
  onChatBoxCreate: (chatBoxId: string) => void
}

function renderToolbar(mm: Markmap, wrapper: HTMLElement) {
  while (wrapper?.firstChild) wrapper.firstChild.remove();
  if (mm && wrapper) {
    const toolbar = new Toolbar();
    toolbar.attach(mm);
    // Register custom buttons
    toolbar.register({
      id: 'alert',
      title: 'Click to show an alert',
      content: 'Alert',
      onClick: () => alert('You made it!'),
    });
    toolbar.setItems([...Toolbar.defaultItems, 'alert']);
    wrapper.append(toolbar.render());
  }
}


export function ChatPanel({ 
  sources, 
  selectedSources, 
  currentChatBoxId, 
  onChatBoxCreate 
}: ChatPanelProps) {
  const { userId } = useAuth()
  const { api } = useNotebookAPI()
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationHistory, setConversationHistory] = useState<MessageProps[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatBoxName, setChatBoxName] = useState('')
  const [error, setError] = useState(null);
  // const [mindMapData, setMindMapData] = useState('');
  // const [isLoadingMindMap, setIsLoadingMindMap] = useState(false);
  const { mindMapData, setMindMapData, isLoadingMindMap, setIsLoadingMindMap, mindMapDocumentId, setMindMapDocumentId } = useMindMapStore(); 
  const selectedSourcesData = sources.filter(s => selectedSources.includes(s.id))

  const transformer = new Transformer();

  // Load conversation history when chatbox changes
  useEffect(() => {
    if (currentChatBoxId) {
      loadConversationHistory()
    } else {
      setMessages([])
      setConversationHistory([])
    }
  }, [currentChatBoxId])

  // Create a new chat box if none exists and we have selected sources
  useEffect(() => {
    if (!currentChatBoxId && selectedSources.length > 0 && userId) {
      createNewChatBox()
    }
  }, [selectedSources, userId, currentChatBoxId])

  const loadConversationHistory = async () => {
    if (!currentChatBoxId) return
    
    try {
    const token = await getToken(); //TOKEN AUTHENTICATION

    if (!token) {
      // Handle kasus kalo user tiba-tiba logout
      toast.error("Your session has expired. Please log in again.");
      return;
    }

      console.log("Calling getChatMessages with ID:", currentChatBoxId); 
      const history = await getChatMessages(currentChatBoxId, token)
      setConversationHistory(history ?? []) 
      
      if(!history || history.length === 0) {
        setMessages([])
        return
      }
      // Convert MessageProps to Message format for display
      const displayMessages: Message[] = []
      for (let i = 0; i < history.length; i += 2) {
        const request = history[i]
        const response = history[i + 1]
        
        if (request && response) {
                     displayMessages.push({
             id: parseInt(response.message_id || Date.now().toString()),
             request: request.message,
             response: response.message,
             userId: userId || '',
             chatBoxId: parseInt(currentChatBoxId),
             createdAt: new Date(),
             liked: response.liked,
             disliked: response.disliked,
             rating: response.rating,
           })
        }
      }
      setMessages(displayMessages)
    } catch (error) {
      console.error('Failed to load conversation history:', error)
      toast.error('Failed to load conversation history')
    }
  }


  const createNewChatBox = async () => {
    if (!userId) return

    const name = selectedSourcesData.length > 0 
      ? `Chat with ${selectedSourcesData[0].title}${selectedSourcesData.length > 1 ? ` and ${selectedSourcesData.length - 1} more` : ''}`
      : 'New Chat'

    try {
      const response = await api.createChatBox({
        userId,
        name,
      })
      onChatBoxCreate(response.id)
      setChatBoxName(name)
    } catch (error) {
      console.error('Failed to create chat box:', error)
      toast.error('Failed to create chat session')
    }
  }

  

  const handleSendMessage = async (messageSend: string) => {
    if (!messageSend.trim() || !userId || !currentChatBoxId) return;

    const userMessage = messageSend;
    setInputValue('');
    setIsLoading(true)

    // Buat pesan pengguna dan pesan AI yang masih kosong
    const tempUserMessageId = Date.now();
    const tempAiMessageId = tempUserMessageId + 1;

    setMessages(prev => [
        ...prev,
        {
            id: tempUserMessageId,
            request: userMessage,
            response: '',
            userId,
            chatBoxId: parseInt(currentChatBoxId),
            createdAt: new Date(),
        },
        {
            id: tempAiMessageId,
            request: '', // AI response tidak punya request
            response: '', // Tampilkan indikator loading awal
            userId,
            chatBoxId: parseInt(currentChatBoxId),
            createdAt: new Date(),
        }
    ]);

    try {
        const response = await fetch('http://localhost:5000/llm/chat_with_llm', { // URL endpoint kamu
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: userMessage,
                userId,
                conversation_history: conversationHistory,
                hyde: 'true', // sesuaikan dengan logikamu
                reranking: 'true'
            }),
        });

        if (!response.body) throw new Error("Response body is null");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        setIsLoading(false);

        // Loop untuk membaca stream
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n\n').filter(line => line.trim());

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.substring(6);
                    if (dataStr === '[DONE]') {
                        // Simpan jawaban lengkap ke database setelah selesai
                        // api.createMessage({ ... , response: fullResponse });
                        return;
                    }
                    
                    try {
                        const data = JSON.parse(dataStr);

                        // Cek apakah ini data token jawaban atau ID dokumen
                        if (data.answer_token) {
                            for (const char of data.answer_token) {
                              // Tambahkan satu karakter ke state
                              setMessages(prev =>
                                  prev.map(msg =>
                                      msg.id === tempAiMessageId
                                          ? { ...msg, response: msg.response + char }
                                          : msg
                                  )
                              );
                              // Beri jeda singkat sebelum karakter berikutnya
                              await sleep(5); // <-- Sesuaikan angka ini (dalam milidetik)
                            }
                        } else if (data.retrieved_doc_ids) {
                            console.log("Retrieved document IDs:", data.retrieved_doc_ids);
                            // Kamu bisa simpan ID ini di state terpisah jika perlu
                        }

                    } catch(e) {
                         console.error("Failed to parse JSON from stream", e);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Failed to stream message:', error);
        setMessages(prev => prev.map(msg => 
            msg.id === tempAiMessageId ? {...msg, response: "Sorry, an error occurred."} : msg
        ));
    } 
  };

  useEffect(() => {
    const handleMindMapClick = (event: CustomEvent<string>) => {
      
      const nodeText = event.detail;
      // console.log('Node clicked:', nodeText);
      
      let parsed = JSON.parse(nodeText);

      let node = '';
      let parent = '';
      let prompt = '';
      let docName = sources.find(s => s.id === selectedSources[0])?.title || 'Document';

      try {
        if (!parsed.parentText) {
          prompt = `Discuss what the source explains about ${parsed.nodeText}, in the context of ${docName} document`;
        } else {
          prompt = `Discuss what the source explains about ${parsed.nodeText}, in the context of ${parsed.parentText} in ${docName} document`;
        }
      } catch (e) {
        node = nodeText;
        parent = '';
      }

      handleSendMessage(prompt);
    };

    window.addEventListener('mindmapNodeClick', handleMindMapClick as EventListener);

    return () => {
      window.removeEventListener('mindmapNodeClick', handleMindMapClick as EventListener);
    };
  }, [handleSendMessage]);

  const handleMindMap = async () => {
    // Kalo lagi loading, jangan jalanin fungsi lagi
    if (isLoadingMindMap) return;

    setIsLoadingMindMap(true); // Mulai loading
    // setMindMapData(''); // Bersihin data mind map lama

    try {

      setMindMapDocumentId(selectedSources[0]);

      const mindMap = await api.generateMindMap(
        'private',
        selectedSources[0],
        sources.find(s => s.id === selectedSources[0])?.tag || ''
      );

      console.log('Data mind map:', mindMap);
      
      // Simpan data mind map ke state
      setMindMapData(mindMap);
      // console.log('Sukses dapet data mind map:', data);

    } catch (err) {
      // Kalo ada error di try block (masalah network atau dari throw di atas)
      console.error('Gagal fetch mind map:', err);
    } finally {
      // Apapun yang terjadi (sukses atau gagal), loading selesai
      setIsLoadingMindMap(false);
    }
  };

  const handleMessageFeedback = async (messageId: number, type: 'like' | 'dislike') => {
    try {
      await api.updateMessageFeedback(
        messageId,
        type === 'like' ? true : undefined,
        type === 'dislike' ? true : undefined
      )
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              liked: type === 'like' ? true : false,
              disliked: type === 'dislike' ? true : false
            }
          : msg
      ))
    } catch (error) {
      console.error('Failed to update message feedback:', error)
      toast.error('Failed to update feedback')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-700">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 dark:hover:text-white">Chat</h2>
          <div className="flex items-center gap-2">
            {selectedSources.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''} selected
              </Badge>
            )}
            {chatBoxName && (
              <Badge variant="secondary" className="text-xs">
                {chatBoxName}
              </Badge>
            )}
            {currentChatBoxId && (
              <Badge variant="outline" className="text-xs">
                Session #{currentChatBoxId}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-gray-200 dark:hover:text-white">
                Ready to chat with your documents
              </h3>
              <p className="text-gray-600 dark:text-gray-200 dark:hover:text-white">
                {selectedSources.length > 0 
                  ? `Ask questions about your ${selectedSources.length} selected document${selectedSources.length > 1 ? 's' : ''}`
                  : 'Select documents from the sidebar to start chatting'
                }
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* User Message */}
              { message.request &&(
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 max-w-lg">
                  <p className="text-sm">{message.request}</p>
                </div>
              </div>
              )}
              {/* AI Response */}
              {message.response && (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-2xl p-4 max-w-4xl">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {message.response}
                      </p>
                    </div>
                    
                    {selectedSourcesData.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>Sources:</span>
                          {selectedSourcesData.map(source => (
                            <Badge key={source.id} variant="secondary" className="text-xs">
                              {source.title.length > 30 
                                ? source.title.substring(0, 30) + '...' 
                                : source.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.responseTime && (
                      <div className="mt-2 text-xs text-gray-500">
                        Response time: {message.responseTime}ms
                      </div>
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  <div className="flex items-center gap-2 pl-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-gray-500 hover:text-gray-700"
                      onClick={() => copyToClipboard(message.response)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-gray-700">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-8 px-2 ${message.liked ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => handleMessageFeedback(message.id, 'like')}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-8 px-2 ${message.disliked ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => handleMessageFeedback(message.id, 'dislike')}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 rounded-2xl p-4 max-w-4xl">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-600">
        <div className="max-w-4xl mx-auto">
          {selectedSources.length === 0 && (
            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Select sources from the sidebar to start asking questions about your documents.
              </p>
            </div>
          )}

            {selectedSources.length > 0 && selectedSources.length < 2 && (
            <div className="flex justify-start mb-3">
              <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition"
              onClick={handleMindMap}
              disabled={isLoading || selectedSources.length === 0 || isLoadingMindMap}
              >
              {isLoadingMindMap ? (
                <span className="inline-flex items-center">
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></span>
                Loading...
                </span>
              ) : (
                <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="3" strokeWidth="2" />
                  <circle cx="5" cy="7" r="2" strokeWidth="2" />
                  <circle cx="19" cy="7" r="2" strokeWidth="2" />
                  <circle cx="5" cy="17" r="2" strokeWidth="2" />
                  <circle cx="19" cy="17" r="2" strokeWidth="2" />
                  <line x1="7" y1="7" x2="11" y2="11" strokeWidth="2" />
                  <line x1="17" y1="7" x2="13" y2="11" strokeWidth="2" />
                  <line x1="7" y1="17" x2="11" y2="13" strokeWidth="2" />
                  <line x1="17" y1="17" x2="13" y2="13" strokeWidth="2" />
                </svg>
                Mindmap
                </>
              )}
              </Button>
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
              className="min-h-[60px] pr-12 resize-none dark:text-gray-200 dark:hover:text-white"
              disabled={selectedSources.length === 0 || isLoading}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || selectedSources.length === 0 || isLoading}
              size="sm"
              className="absolute right-2 bottom-2 h-8 w-8 p-0 dark:text-gray-200 dark:hover:text-white"
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