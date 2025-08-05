"use client";
import React, { useEffect, useRef, useState } from "react";
import { BsPencilSquare, BsLayoutSidebarInset, BsMoon, BsSun } from "react-icons/bs"; // Importing the icons
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../../components/ui/hover-card";
import { LuSendHorizontal } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { MessageProps, DocumentProps } from "@/types";
import Link from "next/link";
import ChatBox from "@/components/prompt/chat-box";
import ModelOptions from "@/components/prompt/model-options";
import { answerQuestions } from "@/lib/utils";
import { UserProfileProps } from "@/types";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useStore, useSidebarState } from "@/lib/useStore";
import SessionDialog from "@/components/session_dialog";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

// import { DocumentProps } from "@/types";
import SourceDetailModal from "@/components/prompt/source-detail-modal";
import EvalResultModal from "@/components/prompt/eval-result-modal";

type Props = {
  user: UserProfileProps | null;
  conversations: MessageProps[];
};

const PromptPage = ({ user, conversations }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isOpen, setIsOpen } = useSidebarState();
  const hyde = searchParams.get("hyde");
  const reranking = searchParams.get("reranking");
  const selected_model = searchParams.get("selected_model");
  const temperature = searchParams.get("temperature");
  const { slug } = useParams();
  const [responseTime, setResponseTime] = useState<number>(0);
  const [data, setData] = useState<MessageProps[]>(conversations);
  const [prompt, setPrompt] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>(
    selected_model ? selected_model.toString() : "Llama 3 8B - 4 bit quantization"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPrompting, setIsPrompting] = useState<boolean>(false);
  const [isHydeChecked, setIsHydeChecked] = useState<boolean>(
    hyde === null ? true : hyde === "true" ? true : false
  );
  const [isRerankingChecked, setIsRerankingChecked] = useState<boolean>(
    reranking === null ? true : reranking === "true" ? true : false
  );
  const [temperatures, setTemperature] = useState<number>(
    temperature ? Number(temperature) : 0
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const triggerFunction = useStore((state) => state.triggerFunction);
  const [enableScroll, setEnableScroll] = useState<boolean>(true);

  const scrollDown = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (divRef.current && !isPrompting && prompt === "") {
      divRef.current.innerText = "Start a conversation with LKC";
      divRef.current.classList.add("text-slate-400");
      divRef.current.blur();
    } else if (divRef.current && divRef.current.innerText === "Start a conversation with LKC") {
      divRef.current.innerText = "";
      divRef.current.classList.remove("text-slate-400");
    }
  }, [isPrompting, prompt]);

  useEffect(() => {
    if (enableScroll) {
      scrollDown();
    }
  }, [data, enableScroll]);

  const handleSendPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMessage = {
      type: "request",
      message: prompt,
    };

    const newData = [...data, newMessage];
    setData(newData);
    setIsLoading(true);
    setEnableScroll(true);
    const currentPrompt = prompt
    setPrompt("");
    if (divRef.current) {
      divRef.current.innerText = "";
    }
  
    // TAMBAHKAN BLOK INI
  try {
    // Langkah 1: Ambil jawaban dari LLM (via Next.js -> Python)
    const res = await handleGetResponse();
    if (!res) {
      throw new Error("Gak dapet balasan dari server.");
    }

    // Langkah 2: Simpen ke DB buat dapet ID asli
    // Kita asumsikan handleSaveResponse/handleNewChatBox balikin ID
    let responseMessageId: string | null = null;
    if (!slug) {
      // Lo mungkin perlu ngemodif handleNewChatBox biar balikin ID juga
      const id = await handleNewChatBox(currentPrompt, res.message, res.retrieved_docs);
      // responseMessageId = id ? id.toString() : null;
    } else {
      const id = await handleSaveResponse(currentPrompt, res.message, res.retrieved_docs, slug[0]);
      responseMessageId = id ? id.toString() : null;
    }
    
    // Langkah 3: Update Tampilan Pertama (Jawaban Teks)
    const newResponseForUI: MessageProps = {
      type: "response",
      message: res.message,
      message_id: responseMessageId ?? undefined, // <-- Pake ID asli dari DB, null diganti undefined
      retrieved_docs: res.retrieved_docs,
      sourceDocs: [], // "Ransel" masih kosong
    };
    setData(currentData => [...currentData, newResponseForUI]);

    // Langkah 4: Ambil Detail Dokumen
    if (responseMessageId) {
      const docResponse = await fetch(`/api/retrievedocs/${responseMessageId}`);
      if (docResponse.ok) {
        const docs = await docResponse.json();
        console.log("Retrieved Docs:", docs);
        // Langkah 5: Update Tampilan Kedua (Sumber Dokumen)
        setData(currentData =>
          currentData.map(msg =>
            msg.message_id === responseMessageId ? { ...msg, sourceDocs: docs } : msg
          )
        );
      }
    }

  } catch (error: any) {
    console.error("Error di handleSendPrompt:", error);
    toast.error(error.message || "Terjadi kesalahan");
  } finally {
    // Ini blok "bersih-bersih" yang PASTI jalan, mau error atau enggak
    setIsLoading(false);
    scrollDown();
    setPrompt("");
    setIsPrompting(false);
  }
  };

  const handleRating = (value: number, i: number) => {
    setEnableScroll(false);
    const newData = [...data];
    newData[i].rating = value;
    setData(newData);
  };

  const handleLike = (i: number) => {
    setEnableScroll(false);
    const newData = [...data];
    if (
      newData[i].liked === false ||
      newData[i].liked === null ||
      newData[i].liked === undefined
    ) {
      newData[i].liked = true;
      newData[i].disliked = false;
    } else {
      newData[i].liked = false;
    }
    setData(newData);
  };

  const handleDislike = (i: number) => {
    setEnableScroll(false);
    const newData = [...data];
    if (
      newData[i].disliked === false ||
      newData[i].disliked === null ||
      newData[i].disliked === undefined
    ) {
      newData[i].disliked = true;
      newData[i].liked = false;
    } else {
      newData[i].disliked = false;
    }
    setData(newData);
  };

  const handleUpdateMisc = async (i: number) => {
    setEnableScroll(false);
    const newData = [...data];
    const formData = new FormData();
    formData.append("id", newData[i].message_id || "");
    formData.append("liked", newData[i].liked?.toString() || "");
    formData.append("disliked", newData[i].disliked?.toString() || "");
    formData.append("rating", newData[i].rating?.toString() || "");

    const upload = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/message`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error();
      return "Updated successfully";
    };

    const showToast = (promise: Promise<string>) => {
      toast.promise(promise, {
        loading: "Updating...",
        success: (msg) => {
          return msg;
        },
        error: "Error when updating",
      });
    };
    showToast(upload());
  };

  const handleKeyPressDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendPrompt(e);
    }
  };

  const handleGetResponse = async () => {
    const start = performance.now();
    const res = await answerQuestions(prompt, data, isHydeChecked, isRerankingChecked, selectedModel);
    const end = performance.now();
    setResponseTime(Math.round(end - start));

    // If the response is null, return null
    if (!res)
      { console.log("No response received from the LLM API");
        return null;}

    const newResponse: MessageProps = {
      type: "response",
      message: res.answer,
      retrieved_docs: res.retrieved_docs || [],
    };
    console.log("Response received:", newResponse);
    return newResponse;
  };

  const handleSaveResponse = async (
    request: string,
    response: string,
    retrievedDoc: string[] | undefined,
    chatBoxId: string
  ) => {
    const formData = new FormData();
    formData.append("request", request);
    formData.append("userId", user?.id || "");
    formData.append("response", response);
    if (retrievedDoc) {
      // console.log("Retrieved Document IDs:", retrievedDoc);
      formData.append("retrievedDocIds", JSON.stringify(retrievedDoc));
    }
    formData.append("chatBoxId", chatBoxId);
    formData.append("responseTime", responseTime.toString());

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/message`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Error when saving the response");
      return null;
    }
    const data = await res.json();
    return data.id;
  };

  const handleNewChatBox = async (request: string, response: string, retrieved_doc_ids: string[] | undefined) => {
    const formData = new FormData();
    formData.append("name", "New Chat Box");
    formData.append("userId", user?.id || "");

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/chatbox`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) toast.error("Error creating a new chat");
    else {
      const { id: chatId } = await res.json();
      triggerFunction();
      await handleSaveResponse(request, response, retrieved_doc_ids ,chatId);
      router.push(
        `/prompt/${chatId}?selected_model=${selectedModel}&hyde=${isHydeChecked}&reranking=${isRerankingChecked}&temperature=${temperatures}`
      );
    }
  };

const handleEvaluate = async (messageToEvaluate: MessageProps) => {
  console.log("Evaluating message:", messageToEvaluate);
  if (!messageToEvaluate || !messageToEvaluate.message_id) {
    toast.error("Message ID tidak ditemukan, tidak bisa evaluasi.");
    return;
  }

  // 1. Kumpulin semua data yang dibutuhkan
  // Cari pertanyaan yang relevan untuk jawaban ini
  const requestMessage = data.find((msg, index) => data[index + 1] === messageToEvaluate);
  
  if (!requestMessage) {
    toast.error("Pertanyaan asli tidak ditemukan.");
    return;
  }
  
  const payload = {
    messageId: messageToEvaluate.message_id,
    question: requestMessage.message,
    answer: messageToEvaluate.message,
    contexts: (messageToEvaluate.sourceDocs || []).map(doc => doc.content),
  };

  console.log("Mengirim data untuk evaluasi:", payload);

  // 2. Tembak ke endpoint 'jembatan' di Next.js
  const promise = fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) throw new Error("Gagal memulai evaluasi.");
    return "Evaluasi berhasil dijadwalkan!";
  });

  // 3. Tampilkan notifikasi ke user
  toast.promise(promise, {
    loading: "Memulai evaluasi...",
    success: (msg) => msg,
    error: (err) => err.toString(),
  });
};

const [selectedDoc, setSelectedDoc] = useState<DocumentProps | null>(null);
const [selectedScores, setSelectedScores] = useState<MessageProps | null>(null);

  return (
    <div className={`flex flex-col w-full h-full p-4 relative`}>
      <SessionDialog />
      <div className="flex w-full items-center gap-2 pb-4">
  {!isOpen && 
  <>
  <HoverCard openDelay={100} closeDelay={100}>
    <HoverCardTrigger asChild>
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className="h-fit p-2 rounded-xl border bg-white text-blue-700 hover:bg-white shadow-none hover:shadow-blue-200 hover:shadow dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
        <BsLayoutSidebarInset size={20}/>
      </Button>
    </HoverCardTrigger>
    <HoverCardContent className="p-1 bg-blue-700 text-white w-fit border-none shadow shadow-blue-700 dark:bg-gray-800 dark:text-gray-300" align="start" >
      <p className="text-xs">Open sidebar</p>
    </HoverCardContent>
  </HoverCard>
  <HoverCard openDelay={100} closeDelay={100}>
    <HoverCardTrigger asChild className="items-center justify-center">
      <Link href={"/prompt"} className="flex">
        <Button 
          className="h-fit p-2 rounded-xl border bg-white text-blue-700 hover:bg-white shadow-none hover:shadow-blue-200 hover:shadow dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
          <BsPencilSquare size={20}/>
        </Button>
      </Link>
    </HoverCardTrigger>
    <HoverCardContent className="p-1 bg-blue-700 text-white w-fit border-none shadow shadow-blue-700 dark:bg-gray-800 dark:text-gray-300" align="start">
      <p className="text-xs">Create a new chat</p>
    </HoverCardContent>
  </HoverCard>
  </>
  }
  <ModelOptions
    selectedModel={selectedModel}
    setSelectedModel={setSelectedModel}
    isHydeChecked={isHydeChecked}
    isRerankingChecked={isRerankingChecked}
    setIsHydeChecked={setIsHydeChecked}
    setIsRerankingChecked={setIsRerankingChecked}
    temperatures={temperatures}
    setTemperature={setTemperature}
  />
</div>
      {/* Dark Mode Toggle Button */}
      <button
         onClick={toggleTheme}
         className="fixed top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
         aria-label="Toggle Theme"
       >
 
         {theme === "light" ? <BsSun size={24} /> : <BsMoon size={24} />}
      </button>
      <div className="w-full flex-1 overflow-y-auto pt-2 mb-[60px] px-7">
        {data.length === 0 ? (
          <div className="flex flex-col justify-center m-auto h-full max-w-[900px]">
            <div className="bg-gradient-to-r from-blue-700 to-teal-300 bg-clip-text text-transparent animate-slide-in delay-300">
              <h1 className="md:text-6xl lg:text-7xl font-medium py-3">
                Welcome, {user && user.username}
              </h1>
            </div>
            <h1 className="md:text-6xl lg:text-7xl font-medium py-3 bg-gradient-to-r from-neutral-500 to-sky-700 bg-clip-text text-transparent animate-slide-in delay-300">
              Ready to learn something new?
            </h1>
          </div>
        ) : (
          <div className="flex flex-col m-auto max-w-[900px]">
            {data.map((item, i) => (
              <ChatBox
                key={item.message_id || `msg-${i}`}
                variant={item.type}
                message={item.message}
                sourceDocs={item.sourceDocs} 
                id={i}
                user={user}
                liked={item.liked}
                disliked={item.disliked}
                rating={item.rating}
                handleLike={() => handleLike(i)}
                handleDislike={() => handleDislike(i)}
                handleRating={(value) => handleRating(value, i)}
                handleUpdateMisc={() => handleUpdateMisc(i)}
                handleEvaluate={() => handleEvaluate(item)}
                onSourceClick={(doc) => setSelectedDoc(doc)}
                onShowScores={() => setSelectedScores(item)}
              />
            ))}
            {isLoading && (
              <div className="flex flex-col w-full text-sm justify-start animate-pulse gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full h-7 w-7 bg-slate-200"></div>
                  <div className="w-24 rounded-xl h-7 bg-slate-200"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3/5 rounded-xl h-3 bg-slate-200"></div>
                  <div className="flex-1 rounded-xl h-3 bg-slate-200"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/5 rounded-xl h-3 bg-slate-200"></div>
                  <div className="flex-1 rounded-xl h-3 bg-slate-200"></div>
                </div>
                <div className="w-48 rounded-xl h-5 bg-slate-200"></div>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="absolute bottom-0 right-0 left-0 m-auto w-full flex justify-center items-center px-4 py-3 z-40 bg-white dark:bg-[hsl(var(--background))] overflow-hidden">
  <form
    action="submit"
    onSubmit={handleSendPrompt}
    onKeyDown={handleKeyPressDown}
    className="flex w-full max-w-[900px] items-center gap-x-4 m-auto"
  >
    <div
      className="flex flex-col items-center justify-center w-full min-h-12 max-h-24 bg-slate-100 dark:bg-gray-700 px-5 py-2 overflow-y-auto rounded-xl"
    >
      <div
        ref={divRef}
        contentEditable={!isLoading}
        className="w-full h-fit bg-transparent outline-none whitespace-pre-line text-gray-800 dark:text-white"
        role="textbox"
        onInput={(e) => setPrompt(e.currentTarget.textContent || "")}
        onFocus={() => setIsPrompting(true)}
        onBlur={() => setIsPrompting(false)}
        aria-multiline="true"
      ></div>
    </div>
    <Button disabled={prompt.length === 0 || isLoading} className="bg-blue-700 hover:bg-blue-500">
      <LuSendHorizontal size={20} />
    </Button>
  </form>
</div>
 <SourceDetailModal 
        doc={selectedDoc} 
        isOpen={!!selectedDoc} 
        onClose={() => setSelectedDoc(null)} 
      />
      <EvalResultModal 
        scores={selectedScores} 
        isOpen={!!selectedScores} 
        onClose={() => setSelectedScores(null)} 
      />
    </div>
  );
};

export default PromptPage;
