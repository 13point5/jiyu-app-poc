"use client";

import { nanoid } from "nanoid";
import { CustomNodeTypes } from "@/app/constants";
import ChatNode from "@/components/custom-nodes/chat";
import PDFNode from "@/components/custom-nodes/pdf";
import YoutubeNode from "@/components/custom-nodes/youtube";
import NoteNode from "@/components/custom-nodes/note";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  Panel,
  NodeTypes,
} from "reactflow";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import "reactflow/dist/style.css";
import { FileText, MessagesSquare, StickyNote, Youtube } from "lucide-react";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 50, y: 70 },
    type: CustomNodeTypes.YOUTUBE,
    data: {
      id: "LxI0iofzKWA",
      name: 'LangChain "OpenAI functions" Webinar',
    },
  },
  // {
  //   id: "2",
  //   position: { x: 650, y: 70 },
  //   type: CustomNodeTypes.CHAT,
  //   data: {
  //     name: "Chat",
  //   },
  // },
  // {
  //   id: "3",
  //   position: { x: 1350, y: 50 },
  //   type: CustomNodeTypes.PDF,
  //   data: {
  //     path: "/The-Future-of-Educational-Assessment-White-Paper.pdf",
  //     name: "The Future of Educational Assessment",
  //   },
  // },
];
const initialEdges: Edge[] = [];

const nodeTypes = {
  [CustomNodeTypes.PDF]: PDFNode,
  [CustomNodeTypes.YOUTUBE]: YoutubeNode,
  [CustomNodeTypes.CHAT]: ChatNode,
  [CustomNodeTypes.NOTE]: NoteNode,
};

export default function ReactFlowApp() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      console.log("onNodesChange", changes);
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      console.log("onEdgesChange", changes);
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddBlock = (e: MouseEvent, blockType: CustomNodeTypes) => {
    console.log({ x: e.clientX, y: e.clientY });
    setNodes((prev) => [
      ...prev,
      {
        id: nanoid(),
        position: { x: e.clientX, y: e.clientY },
        type: blockType,
        data: {},
      },
    ]);
  };

  return (
    <div className={`${inter.className} w-screen h-screen`}>
      <ContextMenu>
        <ContextMenuTrigger>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
          >
            <Panel position="top-left">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Jiyu
              </h4>
            </Panel>
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </ContextMenuTrigger>
        <ContextMenuContent className={`${inter.className} w-64`}>
          <ContextMenuItem
            onClick={(e) => handleAddBlock(e, CustomNodeTypes.CHAT)}
            className="cursor-pointer"
          >
            <MessagesSquare size={16} className="mr-3" /> Chat
          </ContextMenuItem>

          <ContextMenuItem
            className="cursor-pointer"
            onClick={(e) => handleAddBlock(e, CustomNodeTypes.NOTE)}
          >
            <StickyNote size={16} className="mr-3" /> Note
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuGroup>
            <ContextMenuLabel>Info Sources</ContextMenuLabel>

            <ContextMenuItem className="cursor-pointer" inset>
              <Youtube size={16} className="mr-3" /> YouTube
            </ContextMenuItem>

            <ContextMenuItem className="cursor-pointer" inset>
              <FileText size={16} className="mr-3" /> Document
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
