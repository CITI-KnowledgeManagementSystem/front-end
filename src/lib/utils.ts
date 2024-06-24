import { MessageProps } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { env } from "process";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDate(date: string) {
  return new Date(date);
}

export function generateDashboardDocumentsLink(
  type: string,
  userId: string,
  paginationIndex: number,
  rowsPerPage: number,
  searchTerm: string | null = null,
  tags: string[] | null = null
): string {
  const tagsStr = tags
    ? tags
        .map((item) => {
          return `&tag=${item}`;
        })
        .join("")
    : "";

  const searchStr = searchTerm ? `&searchTerm=${searchTerm}` : "";

  if (type === "client") {
    const link = `?page=${paginationIndex}&n=${rowsPerPage}${tagsStr}${searchStr}`;
    return link;
  }

  return `/api/documents?id=${userId}&skip=${paginationIndex}&take=${rowsPerPage}${tagsStr}${searchStr}`;
}

export const answerQuestions = async (
  prompt: string,
  history: any,
  hyde: boolean,
  reranking: boolean
) => {
  const body = {
    collection_name: "private",
    question: prompt,
    conversation_history: history,
    hyde: hyde,
    reranking: reranking,
  };

  const url = process.env.NEXT_PUBLIC_LLM_SERVER_URL;

  const response = await fetch(url + "/llm/chat_with_llm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return data.payload;
};

export const getChatMessages = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/chatbox/` + id,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return sortMessageProps(await response.json());
};

function sortMessageProps(response: any) {
  const data = response.data;
  const messages = [] as MessageProps[];

  if (!data) {
    return messages;
  }

  for (let i = 0; i < data.length; i++) {
    messages.push({
      type: "request",
      message: data[i].request,
    });
    messages.push({
      type: "response",
      message_id: data[i].id,
      message: data[i].response,
      liked: data[i].liked,
      disliked: data[i].disliked,
      rating: data[i].rating,
    });
  }
  return messages;
}
