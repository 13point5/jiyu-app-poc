"use client";

import { nanoid } from "nanoid";
import { CustomNodeTypes } from "@/app/ReactFlow/constants";
import ChatNode from "@/components/custom-nodes/chat";
import PDFNode from "@/components/custom-nodes/pdf";
import YoutubeNode from "@/components/custom-nodes/youtube";
import NoteNode from "@/components/custom-nodes/note";
import WebsiteNode from "@/components/custom-nodes/website";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
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

const nodeTypes = {
  [CustomNodeTypes.PDF]: PDFNode,
  [CustomNodeTypes.YOUTUBE]: YoutubeNode,
  [CustomNodeTypes.CHAT]: ChatNode,
  [CustomNodeTypes.NOTE]: NoteNode,
  [CustomNodeTypes.WEBSITE]: WebsiteNode,
};
import { shallow } from "zustand/shallow";
import useStore from "./store";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
});

export default function ReactFlowApp() {
  const { nodes, edges, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const handleAddBlock = (e: MouseEvent, blockType: CustomNodeTypes) => {
    addNode({
      id: nanoid(),
      position: { x: e.clientX, y: e.clientY },
      type: blockType,
      data: {},
    });
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
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Jiyu
              </h1>
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
