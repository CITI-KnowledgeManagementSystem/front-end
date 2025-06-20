import { MessageProps } from "@/types";
import { auth } from "@clerk/nextjs/server";

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
  history: MessageProps[],
  hyde: boolean,
  reranking: boolean,
  selectedModel: string
) => {
  const formData = new FormData();
  formData.append("question", prompt);
  formData.append("conversation_history", JSON.stringify(history));
  formData.append("hyde", hyde.toString());
  formData.append("reranking", reranking.toString());
  formData.append("selected_model", selectedModel);

  console.log(history);

  const response = await fetch(process.env.NEXT_PUBLIC_SERVER_API + "/prompt", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) return null;

  const data = await response.json();

  const { message } = data;

  return message;
};

export const getChatMessages = async (id: string) => {
  const { getToken } = auth();
  const token = await getToken();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/chatbox/` + id,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return sortMessageProps(data);
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

export const updateDocumentMetadata = async (
  documentId: string,
  title: string,
  topic: string,
  isPublic: Boolean,
  change: Boolean
) => {
  console.log(documentId, title, topic, isPublic, change);
  const formData = new FormData();
  formData.append("id", documentId);
  formData.append("title", title);
  formData.append("topic", topic);
  change
    ? formData.append(
        "public",
        isPublic !== null ? (!isPublic).toString() : "public"
      )
    : formData.append(
        "public",
        isPublic !== null ? isPublic.toString() : "private"
      );

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/document`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    return "Error during updating records!";
  }
};

export const deleteDocumentFromVDB = async (
  documentId: string,
  collectionName: string
) => {
  const res = await fetch(
    `${process.env.LLM_SERVER_URL}/document/delete?document_id=${documentId}&collection_name=${collectionName}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    return "Error during deleting document from VDB!";
  }
};

export const insertDocumentToVDB = async (
  documentId: string,
  userId: string | null | undefined,
  tag: string,
  collectionName: string,
  change?: Boolean
) => {
  const body = {
    document_id: documentId,
    user_id: userId,
    tag: tag,
    collection_name: collectionName,
    change: change,
  };

  const res = await fetch(
    `${process.env.LLM_SERVER_URL}/document/insert`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    return "Error during inserting document to VDB!";
  }
};

export const deleteDocument = async (
  documentId: string | undefined,
  userId: string | undefined
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/document/?id=${documentId}&user_id=${userId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    return "Error during deleting document!";
  }
};
