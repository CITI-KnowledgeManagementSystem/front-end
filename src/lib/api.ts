// API service functions for the notebook interface
import { useAuth } from '@clerk/nextjs'

// Types
export interface ChatBox {
  id: number
  name: string
  updatedAt: Date
}

export interface ChatBoxGroup {
  [key: string]: ChatBox[]
}

export interface Document {
  id: string
  title: string
  topic: string
  filename: string
  file_size: number
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: number
  request: string
  response: string
  userId: string
  chatBoxId: number
  createdAt: Date
  responseTime?: number
  liked?: boolean
  disliked?: boolean
  rating?: number
}

export interface UploadDocumentData {
  title: string
  topic: string
  file: File
  user_id: string
}

export interface CreateChatBoxData {
  userId: string
  name: string
}

export interface CreateMessageData {
  request: string
  userId: string
  chatBoxId: string
  response: string
  responseTime?: number
}

// API Functions
export class NotebookAPI {
  private static async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }
    return response.json()
  }

  // ChatBox API
  static async getChatBoxes(userId: string): Promise<{ message: string; data: ChatBoxGroup }> {
    const response = await fetch(`/api/chatbox?user_id=${userId}`)
    return this.handleResponse(response)
  }

  static async createChatBox(data: CreateChatBoxData): Promise<{ message: string; id: string }> {
    const formData = new FormData()
    formData.append('userId', data.userId)
    formData.append('name', data.name)

    const response = await fetch('/api/chatbox', {
      method: 'POST',
      body: formData,
    })
    return this.handleResponse(response)
  }

  static async updateChatBox(id: number, name: string): Promise<{ message: string }> {
    const formData = new FormData()
    formData.append('id', id.toString())
    formData.append('name', name)

    const response = await fetch('/api/chatbox', {
      method: 'PUT',
      body: formData,
    })
    return this.handleResponse(response)
  }

  static async deleteChatBox(id: number): Promise<{ message: string }> {
    const response = await fetch(`/api/chatbox?id=${id}`, {
      method: 'DELETE',
    })
    return this.handleResponse(response)
  }

  // Document API
  static async uploadDocument(data: UploadDocumentData): Promise<{ message: string }> {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('title', data.title)
    formData.append('topic', data.topic)
    formData.append('user_id', data.user_id)

    const response = await fetch('/api/document', {
      method: 'POST',
      body: formData,
    })
    return this.handleResponse(response)
  }

  static async downloadDocument(id: string, tag: string): Promise<Blob> {
    const response = await fetch(`/api/document?id=${id}&tag=${tag}`)
    if (!response.ok) {
      throw new Error(`Failed to download document: ${response.statusText}`)
    }
    return response.blob()
  }

  static async updateDocument(
    id: string,
    title: string,
    topic: string,
    isPublic: boolean
  ): Promise<{ message: string }> {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('title', title)
    formData.append('topic', topic)
    formData.append('public', isPublic.toString())

    const response = await fetch('/api/document', {
      method: 'PUT',
      body: formData,
    })
    return this.handleResponse(response)
  }

  static async deleteDocument(id: string): Promise<{ message: string }> {
    const response = await fetch(`/api/document?id=${id}`, {
      method: 'DELETE',
    })
    return this.handleResponse(response)
  }

  // Documents API (for listing)
  static async getDocuments(params?: {
    searchTerm?: string
    tag?: string[]
    page?: number
    n?: number
    userId?: string
  }): Promise<{ message: string; data: Document[]; total: number }> {
    const searchParams = new URLSearchParams()
    
    if (params?.searchTerm) searchParams.append('searchTerm', params.searchTerm)
    if (params?.tag) params.tag.forEach(t => searchParams.append('tag', t))
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.n) searchParams.append('n', params.n.toString())
    if (params?.userId) searchParams.append('userId', params.userId)

    const response = await fetch(`/api/documents?${searchParams.toString()}`)
    return this.handleResponse(response)
  }

  // Message API
  static async createMessage(data: CreateMessageData): Promise<{ message: string; id: number }> {
    const formData = new FormData()
    formData.append('request', data.request)
    formData.append('userId', data.userId)
    formData.append('chatBoxId', data.chatBoxId)
    formData.append('response', data.response)
    if (data.responseTime) formData.append('responseTime', data.responseTime.toString())

    const response = await fetch('/api/message', {
      method: 'POST',
      body: formData,
    })
    return this.handleResponse(response)
  }

  static async updateMessageFeedback(
    id: number,
    liked?: boolean,
    disliked?: boolean,
    rating?: number
  ): Promise<{ message: string }> {
    const formData = new FormData()
    formData.append('id', id.toString())
    if (liked !== undefined) formData.append('liked', liked.toString())
    if (disliked !== undefined) formData.append('disliked', disliked.toString())
    if (rating !== undefined) formData.append('rating', rating.toString())

    const response = await fetch('/api/message', {
      method: 'PUT',
      body: formData,
    })
    return this.handleResponse(response)
  }

  // LLM Server Integration
  static async queryLLM(
    questions: string[],
    userId?: string,
    documents?: string[],
    hyde: boolean = true,
    reranking: boolean = true,
    selectedModel: string = "Llama 3 8B - 4 bit quantization"
  ): Promise<any> {
    // Use the internal API route instead of directly calling external LLM server
    const formData = new FormData()
    formData.append("question", questions[0]) // Take first question for now
    formData.append("conversation_history", JSON.stringify([]))
    formData.append("hyde", hyde.toString())
    formData.append("reranking", reranking.toString())
    formData.append("selected_model", selectedModel)

    const response = await fetch('/api/prompt', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`LLM query failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.message
  }
}

// Custom hooks for API integration
export function useNotebookAPI() {
  const { userId } = useAuth()

  return {
    userId,
    api: NotebookAPI,
  }
} 