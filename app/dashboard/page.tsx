"use client";

import { useEffect, useState } from "react";

// import Canvas from "@/app/HardWay";

import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/app/supabaseTypes";
import { CreateBoardButton } from "@/app/dashboard/components/create-board-button";
import { useBoards } from "@/app/dashboard/hooks/useBoards";

type BoardsTable = Database["public"]["Tables"]["boards"]["Row"];

export default function Dashboard() {
  const { fetching, data: boards, error } = useBoards();

  if (fetching)
    return (
      <div>
        <p>fetching...</p>
      </div>
    );

  if (error) return <p>error: {error.message}</p>;

  console.log("boards", boards);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <h1 className="text-3xl font-bold">Boards</h1>

        <CreateBoardButton />
      </div>

      <div className="flex flex-wrap gap-4">
        {boards.map((board) => (
          <Link key={board.id} href={`/board/${board.id}`}>
            <div className="p-2 rounded-md shadow-sm bg-slate-200 w-fit">
              <span>{board.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
