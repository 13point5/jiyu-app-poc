"use client";

import PDFNode from "@/components/custom-nodes/pdf";

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
  { id: "1", position: { x: 50, y: 50 }, data: { label: "1" } },
  { id: "2", position: { x: 100, y: 100 }, data: { label: "2" } },
  {
    id: "3",
    position: { x: 200, y: 200 },
    type: "pdf",
    data: { path: "/The-Future-of-Educational-Assessment-White-Paper.pdf" },
  },
];
const initialEdges: Edge[] = [];

const nodeTypes: NodeTypes = {
  pdf: PDFNode,
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
