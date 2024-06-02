import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { UserProfileProps } from "@/types";

interface Props {
  variant: string;
  message: string;
  user: UserProfileProps | null;
}

const ChatBox = ({ variant, message, user }: Props) => {
  if (variant === "request") {
    return (
      <div className="w-full">
        <div className="flex items-center gap-x-2">
          <Avatar className="w-6 h-6 rounded-full overflow-hidden">
            <AvatarImage
              className="object-cover"
              src={user?.img_url || "./taiwan-tech.png"}
            />
            <AvatarFallback className="text-xs">RT</AvatarFallback>
          </Avatar>
          <h2 className="text-sm font-medium">{user?.username}</h2>
        </div>
        <p
          className="text-sm bg-blue-700 rounded-lg py-2 px-4 text-white mt-2 mb-4"
          style={{ whiteSpace: "pre-line" }}
        >
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full my-1">
      <div className="flex items-center gap-x-2">
        <Avatar className="w-6 h-6 rounded-full overflow-hidden">
          <AvatarImage className="object-cover" src="./taiwan-tech.png" />
          <AvatarFallback className="text-xs">TW</AvatarFallback>
        </Avatar>
        <h2 className="text-sm font-medium">Ai Llama 2</h2>
      </div>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");

            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                PreTag="div"
                language={match[1]}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
        className={"text-sm mb-4"}
      >
        {message}
      </Markdown>
    </div>
  );
};

export default ChatBox;
