"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsPencil,
} from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import UserProfile from "./user-profile";
import { useAuth } from "@clerk/nextjs";
import useStore from "@/lib/useStore";
import ChatName from "./chat-name";

interface T {
  id: number;
  name: string;
  updatedAt: Date;
}

interface ChatBoxGroup {
  [key: string]: T[];
}

function sortChatBox(chatBox: ChatBoxGroup) {
  const sortingOrder = {
    Today: 0,
    Yesterday: 1,
    "Last 7 Days": 2,
    "Last 30 Days": 3,
    December: 4,
    November: 5,
    October: 6,
    September: 7,
    August: 8,
    July: 9,
    June: 10,
    May: 11,
    April: 12,
    March: 13,
    February: 14,
    January: 15,
  };

  function getSortOrder(key: string) {
    if (sortingOrder.hasOwnProperty(key)) {
      return sortingOrder[key as keyof typeof sortingOrder];
    } else {
      return new Date().getFullYear() - Number(key) + 15;
    }
  }

  const sortedKeys = Object.keys(chatBox).sort((a, b) => {
    const orderA = getSortOrder(a) as number;
    const orderB = getSortOrder(b) as number;
    return orderA - orderB;
  });

  return sortedKeys;
}

const SidebarPrompt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatBox, setChatBox] = useState<ChatBoxGroup | null>(null);
  const [sortedKeys, setSortedKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userId } = useAuth();

  const setFunction = useStore((state) => state.setFunction);

  const getChatBox = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/chatbox?user_id=` +
        userId?.toString()
    );
    const data = await response.json();
    setChatBox(data.data as ChatBoxGroup);
    let sortedKeys = sortChatBox(data.data as ChatBoxGroup);
    setSortedKeys(sortedKeys);
  };

  useEffect(() => {
    setFunction(getChatBox);
  }, [setFunction]);

  useEffect(() => {
    getChatBox().then((res) => {
      setIsLoading(false);
    });
  }, []);

  return (
    <aside className={`h-screen`}>
      <nav
        className={`h-full ${
          isOpen ? "w-72 p-4" : "w-0 py-5"
        } flex flex-col bg-slate-200 border-r shadow-sm relative duration-300 ease-in-out`}
      >
        {!isOpen && (
          <HoverCard>
            <HoverCardTrigger asChild className="w-fit mx-3 z-40">
              <Link href={"/prompt"}>
                <GoPlus
                  size={30}
                  className="p-1 rounded-full bg-slate-200 cursor-pointer hover:bg-slate-300"
                />
              </Link>
            </HoverCardTrigger>
            <HoverCardContent
              className="p-1 bg-slate-700 text-white w-fit"
              align="start"
            >
              <p className="text-xs">Create a new chat</p>
            </HoverCardContent>
          </HoverCard>
        )}
        {isOpen ? (
          <HoverCard>
            <HoverCardTrigger
              asChild
              className="w-fit absolute -right-10 top-1/2 z-40"
            >
              <BsArrowLeftCircle
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                size={26}
              />
            </HoverCardTrigger>
            <HoverCardContent
              className="p-1 bg-slate-700 text-white w-fit"
              align="start"
            >
              <p className="text-xs">Close the sidebar</p>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <HoverCard>
            <HoverCardTrigger
              asChild
              className="w-fit absolute -right-10 top-1/2 z-40"
            >
              <BsArrowRightCircle
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                size={26}
              />
            </HoverCardTrigger>
            <HoverCardContent
              className="p-1 bg-slate-700 text-white w-fit"
              align="start"
            >
              <p className="text-xs">Open the sidebar</p>
            </HoverCardContent>
          </HoverCard>
        )}
        {isOpen && (
          <HoverCard openDelay={100}>
            <HoverCardTrigger asChild>
              <Link href={"/prompt"}>
                <Button
                  variant={"ghost"}
                  className="w-full flex justify-between mb-5 relative"
                >
                  <div className="flex items-center gap-x-2">
                    <Image
                      src={"/taiwan-tech.png"}
                      alt="logo image"
                      width={20}
                      height={20}
                    />
                    <h2 className="font-semibold">New Chat</h2>
                  </div>
                  <BsPencil />
                </Button>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit text-xs p-2 bg-slate-700 text-white">
              <p>Create a new chat</p>
            </HoverCardContent>
          </HoverCard>
        )}

        {isOpen && (
          <div className="flex-1 overflow-y-auto mb-3">
            {isLoading ? (
              <div className="flex w-full text-blue-700 items-center justify-center h-full">
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-6 h-6 me-3 text-gray-200 animate-spin dark:text-gray-600"
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
              </div>
            ) : (
              chatBox &&
              sortedKeys.map((key) => {
                return (
                  <div className="w-full my-2" key={key}>
                    <label className="text-muted-foreground text-xs font-semibold">
                      {key}
                    </label>
                    {chatBox[key].map((item, i) => (
                      <ChatName
                        id={item.id.toString()}
                        name={item.name}
                        key={i}
                      />
                    ))}
                  </div>
                );
              })
            )}
          </div>
        )}
        {isOpen && <UserProfile />}
      </nav>
    </aside>
  );
};

export default SidebarPrompt;
