"use client";

import { useState, useRef } from "react";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes, widths } from "@/app/constants";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Info, Eye, EyeOff } from "lucide-react";
import { nanoid } from "nanoid";
import editorConfig from "@/app/tiptapConfig";
import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";
import { useWhisper } from "@chengsokdara/use-whisper";

import useStore from "@/app/reactFlowStore";
import { formatHTMLWithMentions } from "@/app/utils";
import { chat as chatCall } from "@/dummy/chat";

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
  id,
}: {
  type: CustomNodeTypes;
  xPos: number;
  yPos: number;
  data: {
    name: string;
  };
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  console.log({ recording, speaking, transcribing, transcript });

  console.log("messages", messages);

  const editor = useEditor({
    ...editorConfig,
  });

  const addNode = useStore((state) => state.addNode);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // await chatCall();
    // return;

    setLoading(true);

    try {
      const htmlContent = editor?.getHTML() || "";

      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          role: OpenAIRoles.USER,
          content: htmlContent,
        },
      ]);

      editor?.commands.clearContent();

      const formattedQuery = formatHTMLWithMentions(htmlContent);

      // const res = await axios.post("http://localhost:8000/chat", {
      //   message: formattedQuery,
      // });
      const res = await chatCall(formattedQuery);
      console.log("res", res);

      const responseId = nanoid();

      setMessages((prev) => [
        ...prev,
        {
          id: responseId,
          role: OpenAIRoles.ASSISTANT,
          content: res.output.text,
        },
      ]);

      // const segments = JSON.parse(res.data.source_documents[0].metadata.segments);
      const segments = res.output.sourceDocuments[0].metadata.segments;
      segments?.forEach((doc, docIndex: number) => {
        addNode({
          id: nanoid(),
          hidden: true,
          responseId,
          position: {
            x: xPos + docIndex * (widths[CustomNodeTypes.YOUTUBE] + 100),
            y: yPos + (nodeRef?.current?.clientHeight || 0) + 300,
          },
          type: CustomNodeTypes.YOUTUBE,
          data: {
            id: "LxI0iofzKWA",
            start: doc.start,
            end: doc.end,
            sourceText: res.output.sourceDocuments[0].pageContent,
          },
        });
      });

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          role: OpenAIRoles.ASSISTANT,
          content: "Sorry I didn't get that. Can you please rephrase?",
        },
      ]);
    }
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
                blockId={id}
              />
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <EditorContent
            editor={editor}
            className="border border-gray-300 rounded-md p-2 bg-white"
            style={{
              width: "100%",
            }}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>

          <Button onClick={recording ? stopRecording : startRecording}>
            {recording ? "Stop" : "Start"} Recording
          </Button>
        </div>
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
  blockId: string;
};

const Message = ({ id, blockId, role, content, isLast = false }: Props) => {
  const editor = useEditor({
    ...editorConfig,
    editorProps: {
      attributes: {
        class: "bg-transparent",
      },
    },
    content,
    editable: false,
  });

  const [showSources, setShowSources] = useState(false);
  const setSourcesVisibility = useStore((state) => state.setSourcesVisibility);

  const toggleSources = () => {
    setSourcesVisibility(id, blockId, !showSources);
    setShowSources(!showSources);
  };

  return (
    <div className={`flex gap-3`}>
      <span>{role === OpenAIRoles.ASSISTANT ? "🤖" : "👤"}</span>

      <div className="w-full">
        <EditorContent
          editor={editor}
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
