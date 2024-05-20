import { MessageProps } from "@/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseDate(date:string) {
  return new Date(date)
}

export const answerQuestions = async (prompt:string) => {
  const response = await fetch('http://140.118.101.189:5000/answer_questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questions: [prompt] }),
  });

  const data = await response.json();
  return data;
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