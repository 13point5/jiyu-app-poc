"use client";

import { useParams } from "next/navigation";
import { useBlocks } from "@/app/board/[id]/hooks/useBlocks";
import Canvas from "./components/Canvas";
import RFlow from "../../ReactFlow";
import { Loader2 } from "lucide-react";
import { Worker } from "@react-pdf-viewer/core";

export default function BoardPage() {
  const params = useParams();
  const boardId = parseInt(params.id, 10);

  const blocksData = useBlocks(boardId);
  console.log("blocksData", blocksData);

  if (blocksData.fetching) return <Loader2 />;

  if (blocksData.error) return <p>error: {blocksData.error.message}</p>;

  // return <Canvas blocks={blocksData.data} boardId={boardId} />;
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <RFlow />
    </Worker>
  );
}
