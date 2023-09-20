"use client";

import { useEffect, useState } from "react";

// import Canvas from "@/app/HardWay";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/app/supabaseTypes";
import { CreateBoardButton } from "@/app/dashboard/components/create-board-button";

type BoardsTable = Database["public"]["Tables"]["boards"]["Row"];

export default function Dashboard() {
  const supabase = createClientComponentClient();

  const [fetching, setFetching] = useState(true);
  const [boards, setBoards] = useState<BoardsTable[]>([]);
  console.log("boards", boards);

  // Fetch Boards on load
  useEffect(() => {
    const fetchBoards = async () => {
      const res = await supabase.from("boards").select();
      const data = res.data as BoardsTable[];
      setBoards(data);
      setFetching(false);
    };

    fetchBoards();
  }, [supabase]);

  // Subscribe to realtime creation of Boards
  useEffect(() => {
    const channel = supabase
      .channel("realtime boards")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "boards",
        },
        (payload) => {
          if (payload.new) {
            const newBoard = payload.new as BoardsTable;
            setBoards((prev) => [...prev, newBoard]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (fetching)
    return (
      <div>
        <p>fetching...</p>
      </div>
    );

  console.log("boards", boards);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <h1 className="text-3xl font-bold">Boards</h1>

        <CreateBoardButton />
      </div>

      <div className="flex flex-wrap gap-4">
        {boards.map((board) => (
          <div
            key={board.id}
            className="p-2 rounded-md shadow-sm bg-slate-200 w-fit"
          >
            <span>{board.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
