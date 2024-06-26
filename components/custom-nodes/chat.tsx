"use client";

import axios from "axios";
import { useOnSelectionChange } from "reactflow";
import { useState, useRef, useEffect } from "react";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes, widths } from "@/app/ReactFlow/constants";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Info, Eye, EyeOff, Mic, Pause } from "lucide-react";
import { nanoid } from "nanoid";
import editorConfig from "@/lib/tiptapConfig";
import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";
// import { useWhisper } from "@chengsokdara/use-whisper";

import { formatHTMLWithMentions, restoreHTMLFromMentions } from "@/app/utils";

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
  id: string;
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

  // const {
  //   recording,
  //   speaking,
  //   transcribing,
  //   transcript,
  //   startRecording,
  //   stopRecording,
  // } = useWhisper({
  //   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  //   removeSilence: true,
  // });

  const [transcriptText, setTranscriptText] = useState<string>("");

  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      console.log("changed selection", nodes, edges);
      setSelectedNodes((prev) => [
        ...prev,
        ...nodes.map((n) => n.id).filter((nodeId) => nodeId !== id),
      ]);
    },
  });

  // useEffect(() => {
  //   setTranscriptText(transcript.text || "");
  // }, [transcript.text]);

  // console.log("messages", messages);

  const editor = useEditor({
    ...editorConfig,
  });

  // const addNode = useStore((state) => state.addNode);

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      let query = "";

      if (transcriptText) {
        console.log("transcript", transcriptText);
        console.log("selectedNodes", selectedNodes);

        query = `User query: ${transcriptText}\n\nBlocks: ${selectedNodes
          .map((nodeId) => `<@block:${nodeId}>`)
          .join(",")}`;
        console.log("query", query);

        setTranscriptText("");
        setSelectedNodes([]);
      } else {
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

        query = formatHTMLWithMentions(htmlContent);
      }

      const res = await axios.get(`http://localhost:8000/qa?query=${query}`);
      console.log("res", res);

      const responseId = nanoid();

      setMessages((prev) => [
        ...prev,
        {
          id: responseId,
          role: OpenAIRoles.ASSISTANT,
          // content: res.output.text,
          content: restoreHTMLFromMentions(res.data.output),
        },
      ]);

      // const segments = JSON.parse(res.data.source_documents[0].metadata.segments);
      // const segments = res.output.sourceDocuments[0].metadata.segments;
      // segments?.forEach((doc, docIndex: number) => {
      //   addNode({
      //     id: nanoid(),
      //     hidden: true,
      //     responseId,
      //     position: {
      //       x: xPos + docIndex * (widths[CustomNodeTypes.YOUTUBE] + 100),
      //       y: yPos + (nodeRef?.current?.clientHeight || 0) + 300,
      //     },
      //     type: CustomNodeTypes.YOUTUBE,
      //     data: {
      //       id: "LxI0iofzKWA",
      //       start: doc.start,
      //       end: doc.end,
      //       sourceText: res.output.sourceDocuments[0].pageContent,
      //     },
      //   });
      // });

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

          {/* <Button onClick={recording ? stopRecording : startRecording}>
            {recording ? <Pause size={16} /> : <Mic size={16} />}
          </Button> */}
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

  // const [showSources, setShowSources] = useState(false);
  // const setSourcesVisibility = useStore((state) => state.setSourcesVisibility);

  // const toggleSources = () => {
  //   setSourcesVisibility(id, blockId, !showSources);
  //   setShowSources(!showSources);
  // };

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

        {/* {role === OpenAIRoles.ASSISTANT && (
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
        )} */}

        {!isLast && <div className=" bg-slate-300 h-[1px] w-full my-4"></div>}
      </div>
    </div>
  );
};
