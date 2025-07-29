import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { UserProfileProps } from "@/types";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentProps } from "@/types"; 
interface Props {
  variant: string;
  message: string;
  sourceDocs?: DocumentProps[]; // Assuming sourceDocs is an array of DocumentProps
  user: UserProfileProps | null;
  liked?: boolean;
  disliked?: boolean;
  rating?: any;
  handleLike: () => void;
  handleDislike: () => void;
  handleRating: (value: number, i: number) => void;
  handleUpdateMisc?: () => void;
  id: number;
}

const ChatBox = ({
  variant,
  message,
  sourceDocs,
  user,
  liked,
  disliked,
  id,
  rating,
  handleLike,
  handleDislike,
  handleRating,
  handleUpdateMisc,
}: Props) => {
  if (variant === "request") {
    return (
      <div className="w-[60%] min-w-[400px] p-4 bg-slate-100 dark:bg-gray-800 rounded-xl mb-4 ml-auto">
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
        <p className="mt-2 break-all text-blue-800 dark:text-gray-300" style={{ whiteSpace: "pre-line" }}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full my-1">
      <div className="flex items-center gap-x-2">
        <Avatar className="w-6 h-6 rounded-full overflow-hidden">
          <AvatarImage
            className="object-cover"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAClklEQVR4Ab2XAWRbQRiAn5iJKGYgpqJmZmYYoqKmqmBmhmAivBiGmgqGmZqaYSYoGAaCYaaoidkdiqmpmYEZIqqeGYqZioqo8PpdHb2+vty7PEkfX+7J3d3/vbs/d3le6qsmZ2AdgPtzu2piioCvoAfhMb7o6e+mJhk4Q4Aq/IEwDl1XVW3HHFwWGfSbDpKIbltMG0xR0Pd5aHq+HMQEOuD7DtMfcH+mXvdpQl6PVYCMi8ALWNHT3o4J/AsewEWjzxXavjTywkC0dZs6rIF1nau6oxaQwemnEi3IWuRnYT8iERgCISwP63wduhaBwCXLaVNJEOjD7eiTe6zZpmpgEai7/lqgbRFQbJ/OB1/eVxVWAV/e8lwvX7yLEXgSSdKyKbCVIABieoRf0usYgaVIPm2Zax8mCUBpBIH3SQJ6Fq6pimeOAg3H4Flma89FAOpUiJaTgC+6ythxHwkdBdZVxa6LgGYHblh20McwGEHgNxWibxHYiN+CxRrlHcjDDJRBQhjD5+EC4r83pFMLLtHAI1hZP3k4IgFU6J+hzJmJaXBIAD7iB9jTU5qBLKxANzGwLw8oV3VQ+grbEb6vZuBvwoA/KedPDh2eJP50HMAHmNZti5B0hO+ohl8dzneQHykLevASfDfa/IA5Q7IJWtLKF7UEDfd1jU6vfKTQ65xlrOfmMiXDEc7NYroEEw9B9VekTdSS6nzBkiQJiAW9HGEKOsczxxW/HbuxCHMp5ZfNXSwHwTkKdCAbPcPv6sydtMAhzNsPkskKPE36S96YoMAqOL0XLHm+7I1RoAs1GOkF5SYSm2MQ+ER+XfVSXb5UIguwAX13AdHVZ8Ys5djeDy8zcIXyLWxz/48nUwIEEbuUEt7APci5DnsEpqVT/8wdlEMAAAAASUVORK5CYII="
            // size="20"
          />
          <AvatarFallback className="text-xs">TW</AvatarFallback>
        </Avatar>
        <h2 className="text-sm font-medium">Agent</h2>
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
                {String(children).replace(/\n$/, "&nbsp; \n")}
              </SyntaxHighlighter>
            ) : (
              <code className={`inline-code ${className}`} {...props}>
                {children}
              </code>
            );
          },
        }}
        // className="p-2 mt-2 leading-7 break-all text-blue-800 dark:text-white"
      >
        {message}
      </Markdown>

          {sourceDocs && sourceDocs.length > 0 && (
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-gray-700">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
          Documents Source:
        </h4>
        <div className="flex flex-wrap gap-2">
          {sourceDocs.map((doc) => (
            <div 
              key={doc.id} 
              className="text-xs bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 px-2 py-1 rounded-full"
              title={`Topic: ${doc.topic || 'N/A'}`}
            >
              {doc.title}
              <br />
              {doc.original_name}
            </div>
          ))}
        </div>
      </div>
    )}

      <div className="mb-5 flex ">
        <Button
          variant="ghost"
          onClick={handleLike}
          className="mr-[5px] px-[5px] py-[5px] h-[35px]"
        >
          {liked ? (
            <BiSolidLike className="text-blue-700 dark:text-gray-300 cursor-pointer" size={15} />
          ) : (
            <BiLike className="text-blue-700 dark:text-gray-300 cursor-pointer" size={15} />
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={handleDislike}
          className="mr-[5px] px-[5px] py-[5px] h-[35px]"
        >
          {disliked ? (
            <BiSolidDislike
              className="text-blue-700 dark:text-gray-300 cursor-pointer"
              size={15}
            />
          ) : (
            <BiDislike className="text-blue-700 dark:text-gray-300 cursor-pointer" size={15} />
          )}
        </Button>
        <Select onValueChange={(value) => handleRating(value as any, id)}>
          <SelectTrigger className="mx-[5px] w-[60px] h-[35px] dark:text-gray-300">
            <SelectValue placeholder={rating} />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((j) => (
              <SelectItem key={j} value={j.toString()}>
                {j}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          className="mx-[5px] h-[35px] dark:text-gray-300"
          onClick={handleUpdateMisc}
        >
          Update
        </Button>
        <Button
          variant="ghost"
          className="mx-[5px] h-[35px] dark:text-gray-300"
          onClick={() => alert("awkoawkowakowakowakoawk")}
        >
          Evaluate
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
