"use client";
import React, { useEffect, useRef, useState } from "react";
import { BsPencilSquare, BsLayoutSidebarInset } from "react-icons/bs";
import { HoverCard, HoverCardContent, HoverCardTrigger} from "../../../components/ui/hover-card"
import { LuSendHorizonal } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { MessageProps } from "@/types";
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

type Props = {
  user: UserProfileProps | null;
  conversations: MessageProps[];
};

const PromptPage = ({ user, conversations }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isOpen, setIsOpen } = useSidebarState()
  const hyde = searchParams.get("hyde");
  const reranking = searchParams.get("reranking");
  const selected_model = searchParams.get("selected_model");
  const temperature = searchParams.get("temperature");
  const { slug } = useParams();
  const [responseTime, setResponseTime] = useState<number>(0);
  const [data, setData] = useState<MessageProps[]>(conversations);
  const [prompt, setPrompt] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>(
    selected_model ? selected_model.toString() : "Mistral 7B"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPrompting, setIsPrompting] = useState<boolean>(false)
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

  useEffect(() => {
    if (divRef.current && !isPrompting && prompt === "") {
      divRef.current.innerText = "Start a conversation with LKC";
      divRef.current.classList.add("text-slate-400");
      divRef.current.blur()
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

    handleGetResponse().then(async (res) => {
      if (!res) {
        toast.error("Error fetching the data");
      } else {
        if (!slug) {
          await handleNewChatBox(prompt, res.message);
        } else {
          const id = (await handleSaveResponse(
            prompt,
            res.message,
            slug[0]
          )) as number;
          res.message_id = id.toString();
        }
        setData([...newData, res]);
      }
      setIsLoading(false);
      scrollDown();
    });
    setPrompt("");
    setIsPrompting(false);
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
    const res = await answerQuestions(
      prompt,
      data,
      isHydeChecked,
      isRerankingChecked,
      selectedModel
    );
    const end = performance.now();
    setResponseTime(Math.round(end - start));

    // If the response is null, return null
    if (!res) return null;

    const newResponse: MessageProps = {
      type: "response",
      message: res,
    };

    return newResponse;
  };

  const handleSaveResponse = async (
    request: string,
    response: string,
    chatBoxId: string
  ) => {
    const formData = new FormData();
    formData.append("request", request);
    formData.append("userId", user?.id || "");
    formData.append("response", response);
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

  const handleNewChatBox = async (request: string, response: string) => {
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
      await handleSaveResponse(request, response, chatId);
      router.push(
        `/prompt/${chatId}?selected_model=${selectedModel}&hyde=${isHydeChecked}&reranking=${isRerankingChecked}&temperature=${temperatures}`
      );
    }
  };

  return (
    <div className={`flex flex-col w-full h-full p-4 relative`}>
      <SessionDialog />
      <div className="flex w-full items-center gap-2 pb-4">
        {!isOpen && 
        <>
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button onClick={() => setIsOpen(!isOpen)} className="h-fit p-2 rounded-xl border bg-white text-blue-700 hover:bg-white shadow-none hover:shadow-blue-200 hover:shadow">
              <BsLayoutSidebarInset size={20}/>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="p-1 bg-blue-700 text-white w-fit border-none shadow shadow-blue-700" align="start" >
            <p className="text-xs">Open sidebar</p>
          </HoverCardContent>
        </HoverCard>
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild className="items-center justify-center">
            <Link href={"/prompt"} className="flex">
              <Button className="h-fit p-2 rounded-xl border bg-white text-blue-700 hover:bg-white shadow-none hover:shadow-blue-200 hover:shadow">
                <BsPencilSquare size={20}/>
              </Button>
            </Link>
          </HoverCardTrigger>
          <HoverCardContent className="p-1 bg-blue-700 text-white w-fit border-none shadow shadow-blue-700" align="start">
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
      <div className="w-full flex-1 overflow-y-auto pt-2 mb-[60px] px-7">
        {data.length === 0 ? (
          <div className="flex flex-col justify-center m-auto h-full  max-w-[900px]">
            <div className="bg-gradient-to-r from-blue-700 to-teal-300 bg-clip-text text-transparent animate-slide-in delay-300">
              <h1 className="md:text-6xl lg:text-7xl font-medium py-3">
                Welcome, {user && user.username}
              </h1>
            </div>
            <h1 className="md:text-6xl lg:text-7xl font-medium py-3 bg-gradient-to-r from-neutral-500 to-sky-700 bg-clip-text text-transparent animate-slide-in delay-300">
              Ready to learn something new?
            </h1>
          </div>
          ) :
          <div className="flex flex-col m-auto max-w-[900px]">
            {data.map((item, i) => (
              <ChatBox
                key={i}
                variant={item.type}
                message={item.message}
                id={i}
                user={user}
                liked={item.liked}
                disliked={item.disliked}
                rating={item.rating}
                handleLike={() => handleLike(i)}
                handleDislike={() => handleDislike(i)}
                handleRating={(value) => handleRating(value, i)}
                handleUpdateMisc={() => handleUpdateMisc(i)}
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
        }
        <div ref={bottomRef} />
      </div>
      <div className="absolute bottom-0 right-0 left-0 m-auto w-full flex justify-center items-center px-4 py-3 z-40 bg-white overflow-hidden">
        <form
          action="submit"
          onSubmit={handleSendPrompt}
          onKeyDown={handleKeyPressDown}
          className="flex w-full max-w-[900px] items-center gap-x-4 m-auto"
        >
          <div className="flex flex-col items-center justify-center w-full min-h-12 max-h-24 bg-slate-100 px-5 py-2 overflow-y-auto rounded-xl">
            <div
              ref={divRef}
              contentEditable
              className="w-full h-fit bg-transparent outline-none whitespace-pre-line"
              role="textbox"
              onInput={(e) => setPrompt(e.currentTarget.textContent || "")}
              onFocus={() => setIsPrompting(true)}
              onBlur={() => setIsPrompting(false)}
              aria-multiline="true"
            >
          </div>
          </div>
          <Button disabled={prompt.length === 0} className="bg-blue-700 hover:bg-blue-500">
            <LuSendHorizonal size={20}/>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PromptPage;
