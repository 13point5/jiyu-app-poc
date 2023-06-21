"use client";

import { CustomNodeTypes } from "@/app/constants";
import ChatNode from "@/components/custom-nodes/chat";
import PDFNode from "@/components/custom-nodes/pdf";
import YoutubeNode from "@/components/custom-nodes/youtube";

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

import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 50, y: 70 },
    type: CustomNodeTypes.YOUTUBE,
    data: {
      id: "lGaQWIV8PZ4",
      name: "Sal Khan's thoughts on mastery learning",
    },
  },
  {
    id: "2",
    position: { x: 650, y: 70 },
    type: CustomNodeTypes.CHAT,
    data: {
      name: "Trying to understand Sal's thoughts on mastery learning",
    },
  },
  {
    id: "3",
    position: { x: 1350, y: 50 },
    type: CustomNodeTypes.PDF,
    data: {
      path: "/The-Future-of-Educational-Assessment-White-Paper.pdf",
      name: "The Future of Educational Assessment",
    },
  },
];
const initialEdges: Edge[] = [];

const nodeTypes = {
  [CustomNodeTypes.PDF]: PDFNode,
  [CustomNodeTypes.YOUTUBE]: YoutubeNode,
  [CustomNodeTypes.CHAT]: ChatNode,
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

  return (
    <div className="w-screen h-screen ">
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
    </div>
  );
}
