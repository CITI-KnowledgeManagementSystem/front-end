import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'


interface Props {
    variant: string,
    message: string,
    username: string | undefined
}

const ChatBox = ({ variant, message, username }: Props) => {
   
    if(variant === "request"){
        return (
            <div className="w-full">
                <div className="flex items-center gap-x-2">
                    <Avatar className='w-6 h-6 rounded-full overflow-hidden'>
                        <AvatarImage className='object-cover' src='https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'/>
                        <AvatarFallback className='text-xs'>RT</AvatarFallback>
                    </Avatar>
                    <h2 className="text-sm font-medium">{ username }</h2>
                </div>
                <p className='text-sm bg-blue-700 rounded-lg py-2 px-4 text-white mt-2 mb-4' style={{ whiteSpace: 'pre-line' }}>
                    { message }
                </p>
            </div>
        )
    }

  return (
    <div className="w-full my-1">
        <div className="flex items-center gap-x-2">
            <Avatar className='w-6 h-6 rounded-full overflow-hidden'>
                <AvatarImage className='object-cover' src='./taiwan-tech.png'/>
                <AvatarFallback className='text-xs'>TW</AvatarFallback>
            </Avatar>
            <h2 className="text-sm font-medium">Ai Llama 2</h2>
        </div>
        <Markdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
          
                    return !inline && match ? (
                      <SyntaxHighlighter style={dracula} PreTag="div" language={match[1]} {...props}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
            }}
            className={"text-sm mb-4"}>
            { message }
        </Markdown>
    </div>
  )
}

export default ChatBox