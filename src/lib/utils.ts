import { MessageProps } from "@/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseDate(date:string) {
  return new Date(date)
}

export function generateDashboardDocumentsLink(type:string, userId:string, paginationIndex:number, rowsPerPage:number, searchTerm:string | null=null, tags:string[] | null=null):string {

  const tagsStr = tags ? tags.map(item => {
    return `&tag=${item}`
  }).join('') : ''  

  const searchStr = searchTerm ? `&searchTerm=${searchTerm}` : ''
  
  if (type === 'client') {
    const link = `?page=${paginationIndex}&n=${rowsPerPage}${tagsStr}${searchStr}`
    return link
  }

  return `/api/documents?id=${userId}&skip=${paginationIndex}&take=${rowsPerPage}${tagsStr}${searchStr}`
}

export const answerQuestions = async (prompt:string) => {

  const body = {
    "model": "gpt-4", 
    "messages": [
        {   "role": "user",     
            "content": prompt, 
            "temperature": 0.0
        }
    ] 
  }

  const response = await fetch('http://140.118.101.189:8080/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  
  return data.choices[0].message.content;
};

export const getChatMessages = async (id: string) => {
  const response = await fetch('http://localhost:3000/api/chatbox/' +  id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return sortMessageProps(await response.json())
}

function sortMessageProps(response: any) {
  const data = response.data
  const messages = [] as MessageProps[]
  for (let i = 0; i < data.length; i++) {
    messages.push({
      type: 'request',
      message: data[i].request,
    })
    messages.push({
      type: 'response',
      message: data[i].response,
    })
  }
  return messages
}