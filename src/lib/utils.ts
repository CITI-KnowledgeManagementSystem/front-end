import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseDate(date:string) {
  return new Date(date)
}

export const answerQuestions = async (prompt:string) => {
  const response = await fetch('http://localhost:5000/answer_questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questions: [prompt] }),
  });

  const data = await response.json();
  return data;
};