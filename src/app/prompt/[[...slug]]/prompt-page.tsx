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
      <div className="flex w-full items-center gap-2">
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
      <div className="w-full flex-1 overflow-y-auto pt-2 pb-[60px] px-7">
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
              <div className="flex w-full text-blue-700 items-center text-sm justify-start">
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#1C64F2"
                  />
                </svg>
                Processing...
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
