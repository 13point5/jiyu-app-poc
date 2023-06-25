"use client";

import { useState, useRef } from "react";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes, widths } from "@/app/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Info, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { nanoid } from "nanoid";
import editorConfig from "@/app/tiptapConfig";
import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";

import useStore from "@/app/reactFlowStore";

type MessageType = {
  id: string;
  role: OpenAIRoles.USER | OpenAIRoles.ASSISTANT;
  content: string;
};

const ChatNode = ({
  data,
  type,
  xPos,
  yPos,
}: {
  type: CustomNodeTypes;
  xPos: number;
  yPos: number;
  data: {
    id: string;
    name: string;
  };
}) => {
  const nodeRef = useRef(null);
  const [messages, setMessages] = useState<MessageType[]>([
    // {
    //   id: nanoid(),
    //   role: OpenAIRoles.USER,
    //   content: "Hello! I'm OpenAI's GPT-3 chatbot. Ask me anything!",
    // },
    // {
    //   id: nanoid(),
    //   role: OpenAIRoles.ASSISTANT,
    //   content: "Hello! I'm OpenAI's GPT-3 chatbot. Ask me anything!",
    // },
  ]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const editor = useEditor({
    ...editorConfig,
  });

  const addNode = useStore((state) => state.addNode);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("editor", editor?.getHTML());
    console.log("text", editor?.getText());
    console.log("json", editor?.getJSON());
    // return;

    setLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: nanoid(),
        role: OpenAIRoles.USER,
        content: query,
      },
    ]);
    setQuery("");

    const res = await axios.post("http://localhost:8000/chat", {
      message: editor?.getHTML(),
    });
    console.log("res", res);

    const responseId = nanoid();

    setMessages((prev) => [
      ...prev,
      {
        id: responseId,
        role: OpenAIRoles.ASSISTANT,
        content: res.data.result,
      },
    ]);

    const segments = JSON.parse(res.data.source_documents[0].metadata.segments);
    segments?.forEach((doc, docIndex: number) => {
      addNode({
        id: nanoid(),
        hidden: true,
        responseId,
        position: {
          x: xPos + docIndex * (widths[CustomNodeTypes.YOUTUBE] + 100),
          y: yPos + (nodeRef?.current?.offsetHeight || 0) + 300,
        },
        type: CustomNodeTypes.YOUTUBE,
        data: {
          id: "LxI0iofzKWA",
          start: doc.start,
          end: doc.end,
        },
      });
    });

    setLoading(false);
  };

  return (
    <CustomNodeContainer type={type} title={data.name || "Chat"}>
      <div className="flex flex-col gap-2" ref={nodeRef}>
        {messages.length > 0 && (
          <div className="flex flex-col gap-0 my-3">
            {messages.map((message, messageIndex) => (
              <Message
                key={message.id}
                id={message.id}
                role={message.role}
                content={message.content}
                isLast={messageIndex === messages.length - 1}
              />
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          {/* <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message here"
            className="bg-white"
          /> */}
          <EditorContent
            editor={editor}
            className="border border-gray-300 rounded-md p-2 bg-white"
            style={{
              width: "100%",
            }}
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

type Props = MessageType & {
  isLast?: boolean;
};

const Message = ({ id, role, content, isLast = false }: Props) => {
  const editor = useEditor(editorConfig);

  const [showSources, setShowSources] = useState(false);
  const setSourcesVisibility = useStore((state) => state.setSourcesVisibility);

  const toggleSources = () => {
    setSourcesVisibility(id, !showSources);
    setShowSources(!showSources);
  };

  return (
    <div className={`flex gap-3`}>
      <span>{role === OpenAIRoles.ASSISTANT ? "🤖" : "👤"}</span>

      <div className="w-full">
        <EditorContent
          editor={editor}
          content={content}
          style={{
            width: "100%",
          }}
        />

        {role === OpenAIRoles.ASSISTANT && (
          <Button
            onClick={toggleSources}
            size="sm"
            variant="link"
            className="p-0 mt-3 bg-transparent text-slate-500"
          >
            Sources
            {showSources ? (
              <EyeOff className="ml-2" size={16} />
            ) : (
              <Eye className="ml-2" size={16} />
            )}
          </Button>
        )}

        {!isLast && <div className=" bg-slate-300 h-[1px] w-full my-4"></div>}
      </div>
    </div>
  );
};
