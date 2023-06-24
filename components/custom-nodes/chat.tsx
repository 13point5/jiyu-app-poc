"use client";

import { useState } from "react";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes } from "@/app/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import axios from "axios";

type MessageType = {
  role: OpenAIRoles.USER | OpenAIRoles.ASSISTANT;
  content: string;
};

const ChatNode = ({
  data,
  type,
}: {
  type: CustomNodeTypes;
  data: {
    id: string;
    name: string;
  };
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        role: OpenAIRoles.USER,
        content: query,
      },
    ]);
    setQuery("");

    const res = await axios.post("http://localhost:8000/chat", {
      message: query,
    });
    console.log("res", res);

    setMessages((prev) => [
      ...prev,
      {
        role: OpenAIRoles.ASSISTANT,
        content: res.data.result,
      },
    ]);

    setLoading(false);
  };

  return (
    <CustomNodeContainer type={type} title={data.name || "Chat"}>
      <div className="flex flex-col gap-2">
        {messages.length > 0 && (
          <div className="flex flex-col gap-0 my-3">
            {messages.map((message, messageIndex) => (
              <Message
                key={messageIndex}
                role={message.role}
                content={message.content}
                isLast={messageIndex === messages.length - 1}
              />
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message here"
            className="bg-white"
          />
          <Button type="submit">
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>
        </form>
      </div>
    </CustomNodeContainer>
  );
};

export default ChatNode;

export enum OpenAIRoles {
  USER = "user",
  ASSISTANT = "assistant",
}

type Props = {
  role: OpenAIRoles.USER | OpenAIRoles.ASSISTANT;
  content: string | React.ReactNode;
  isLast?: boolean;
};

const Message = ({ role, content, isLast = false }: Props) => {
  return (
    <div className={`flex gap-3`}>
      <span>{role === OpenAIRoles.ASSISTANT ? "🤖" : "👤"}</span>

      <div className="w-full">
        <p>{content}</p>

        {!isLast && <div className=" bg-slate-300 h-[1px] w-full my-4"></div>}
      </div>
    </div>
  );
};
