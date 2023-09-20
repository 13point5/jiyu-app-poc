"use client";

import { useEffect, useState } from "react";

// import Canvas from "@/app/HardWay";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Database } from "@/app/supabaseTypes";

type BoardsTable = Database["public"]["Tables"]["boards"]["Row"];

export default function Dashboard() {
  const supabase = createClientComponentClient();

  const [fetching, setFetching] = useState(true);
  const [boards, setBoards] = useState<BoardsTable[]>([]);
  console.log("boards", boards);

  useEffect(() => {
    const fetchBoards = async () => {
      const res = await supabase.from("boards").select();
      const data = res.data as BoardsTable[];
      setBoards(data);
      setFetching(false);
    };

    fetchBoards();
  }, [supabase]);

  const createNewBoard = async () => {
    const res = await supabase
      .from("boards")
      .insert([
        {
          name: "untitled",
        },
      ])
      .select();
    console.log("res", res);
  };

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

        <Button onClick={createNewBoard}>
          <Plus className="mr-2" /> Create Board
        </Button>
      </div>

      <div className="flex gap-4">
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
