import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const CreateBoardButton = () => {
  const supabase = createClientComponentClient();

  const [dialogVisibility, setDialogVisibility] = useState(false);

  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const createNewBoard = async () => {
    setCreating(true);

    await supabase
      .from("boards")
      .insert([
        {
          name,
        },
      ])
      .select();

    setCreating(false);
    setDialogVisibility(false);
  };

  return (
    <Dialog open={dialogVisibility} onOpenChange={setDialogVisibility}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" /> New Board
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Board</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              defaultValue="untitled"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={createNewBoard} disabled={creating}>
            {creating ? (
              <>
                <Loader2 className="mr-2" /> Creating
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
