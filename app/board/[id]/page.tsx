"use client";

import { useParams } from "next/navigation";
import { useBlocks } from "@/app/board/[id]/hooks/useBlocks";
import Canvas from "./components/Canvas";
import { Loader2 } from "lucide-react";

export default function BoardPage() {
  const params = useParams();
  const boardId = parseInt(params.id, 10);

  const blocksData = useBlocks(boardId);
  console.log("blocksData", blocksData);

  if (blocksData.fetching) return <Loader2 />;

  if (blocksData.error) return <p>error: {blocksData.error.message}</p>;

  return <Canvas blocks={blocksData.data} boardId={boardId} />;
}
