"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageProps } from "@/types";
import ChatBox from "@/components/prompt/chat-box";
import ModelOptions from "@/components/prompt/model-options";
import { answerQuestions } from "@/lib/utils";
import { UserProfileProps } from "@/types";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import useStore from "@/lib/useStore";
import SessionDialog from "@/components/session_dialog";

type Props = {
  user: UserProfileProps | null;
  conversations: MessageProps[];
};

const PromptPage = ({ user, conversations }: Props) => {
  const router = useRouter();
  const { slug } = useParams();
  const [data, setData] = useState<MessageProps[]>(conversations);
  const [prompt, setPrompt] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("Mistral 7B");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHydeChecked, setIsHydeChecked] = useState<boolean>(true);
  const [isRerankingChecked, setIsRerankingChecked] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<number>(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const triggerFunction = useStore((state) => state.triggerFunction);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  const handleSendPrompt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMessage = {
      type: "request",
      message: prompt,
    };
    const newData = [...data, newMessage];
    setData(newData);
    setIsLoading(true);

    handleGetResponse().then((res) => {
      setData([...newData, res]);
      if (slug === undefined) {
        handleChatBox(prompt, res.message);
      } else {
        handleSaveResponse(prompt, res.message, slug[0]);
      }
      setIsLoading(false);
    });
    setPrompt("");
  };

  const handleRating = (value: number, i: number) => {
    const newData = [...data];
    newData[i].rating = value;
    console.log(newData[i].rating);
    setData(newData);
  };

  const handleLike = (i: number) => {
    const newData = [...data];
    if (newData[i].liked === false) {
      newData[i].liked = true;
      newData[i].disliked = false;
      newData[i].rating = 1;
    } else {
      newData[i].liked = false;
      newData[i].rating = 0;
    }
    setData(newData);
  };

  const handleDislike = (i: number) => {
    const newData = [...data];
    if (newData[i].disliked === false) {
      newData[i].disliked = true;
      newData[i].liked = false;
      newData[i].rating = 1;
    } else {
      newData[i].disliked = false;
      newData[i].rating = 0;
    }
    setData(newData);
  };

  const handleKeyPressDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendPrompt(e);
    }
  };

  const handleGetResponse = async () => {
    const res = await answerQuestions(
      prompt,
      data,
      isHydeChecked,
      isRerankingChecked
      //   temperature
    );
    const newResponse = {
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

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/message`, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChatBox = async (request: string, response: string) => {
    const formData = new FormData();
    formData.append("name", "New Chat Box");
    formData.append("userId", user?.id || "");

    try {
      const chatBox = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/chatbox`,
        {
          method: "POST",
          body: formData,
        }
      );
      const chatBoxId = await chatBox.json();
      router.push(`/prompt/${chatBoxId.id}`);
      triggerFunction();
      handleSaveResponse(request, response, chatBoxId.id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col w-full py-4 h-full relative px-[50px] relative">
      <SessionDialog />
      <div className="flex w-full pb-3">
        <ModelOptions
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isHydeChecked={isHydeChecked}
          isRerankingChecked={isRerankingChecked}
          setIsHydeChecked={setIsHydeChecked}
          setIsRerankingChecked={setIsRerankingChecked}
          temperature={temperature}
          setTemperature={setTemperature}
        />
      </div>
      <div className="w-full flex-1 overflow-y-auto mb-5 py-5">
        {data.length === 0 && (
          <div className="flex flex-col justify-center h-full max-w-[900px] m-auto">
            <div className="bg-gradient-to-r from-blue-500 to-teal-300 bg-clip-text text-transparent animate-slide-in delay-300">
              <h1 className="md:text-6xl lg:text-7xl font-medium py-3">
                Welcome, {user && user.username}
              </h1>
            </div>
            <h1 className="md:text-6xl lg:text-7xl font-medium py-3 bg-gradient-to-r from-neutral-500 to-sky-700 bg-clip-text text-transparent animate-slide-in delay-300">
              Ready to learn something new?
            </h1>
          </div>
        )}
        <div className="flex flex-col m-auto max-w-[900px]">
          {data.map((item, i) => (
            <ChatBox
              variant={item.type}
              message={item.message}
              key={i}
              user={user}
              liked={item.liked}
              disliked={item.disliked}
              rating={item.rating}
              message_id={item.message_id}
              handleLike={() => handleLike(i)}
              handleDislike={() => handleDislike(i)}
              handleRating={(value) => handleRating(value, i)}
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
        <div ref={bottomRef} />
      </div>
      <div className="flex justify-center items-center">
        <form
          action="submit"
          onSubmit={handleSendPrompt}
          onKeyDown={handleKeyPressDown}
          className="flex w-full max-w-[900px] items-center gap-x-4"
        >
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt..."
            className="resize-none w-full"
          />
          <Button disabled={prompt.length === 0}>Send</Button>
        </form>
      </div>
    </div>
  );
};

export default PromptPage;
