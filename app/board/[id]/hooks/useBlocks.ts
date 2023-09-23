import { useEffect, useState } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/app/supabaseTypes";

type Tables = Database["public"]["Tables"];

const tableName = "blocks";

type TableName = typeof tableName;

type TableRow = Tables[TableName]["Row"];

type BoardId = TableRow["board_id"];

type HookResult =
  | {
      data: null;
      fetching: true;
      error: null;
    }
  | {
      data: TableRow[];
      fetching: false;
      error: null;
    }
  | {
      data: null;
      fetching: false;
      error: Error;
    };

export const useBlocks = (boardId: BoardId): HookResult => {
  const supabase = createClientComponentClient();

  const [state, setState] = useState<HookResult>({
    data: null,
    error: null,
    fetching: true,
  });

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const res = await supabase
          .from(tableName)
          .select()
          .eq("board_id", boardId);

        if (res.error) {
          throw res.error;
        }

        const data = res.data as TableRow[];

        setState({
          data,
          error: null,
          fetching: false,
        });
      } catch (error) {
        setState({
          data: null,
          error,
          fetching: false,
        });
      }
    };

    fetchTableData();
  }, [supabase, boardId]);

  // Subscribe to realtime insertion
  useEffect(() => {
    const channel = supabase
      .channel(`realtime ${tableName}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: tableName,
          filter: `board_id=${boardId}`,
        },
        (payload) => {
          console.log("payload", payload);
          if (!payload.new) {
            return;
          }

          const newData = payload.new as TableRow;
          setState((prev) => ({
            fetching: false,
            error: null,
            data: [...(prev.data || []), newData],
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, boardId]);

  return state;
};
