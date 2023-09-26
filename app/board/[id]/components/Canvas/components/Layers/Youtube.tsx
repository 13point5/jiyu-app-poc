import { YoutubeLayer } from "@/app/board/[id]/components/Canvas/types";
import { colorToCss } from "@/app/board/[id]/components/Canvas/utils";

import { Plus, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";

type FormSchema = {
  url: string;
};

type Props = {
  id: string;
  layer: YoutubeLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
};

export default function YoutubeBlock({
  layer,
  onPointerDown,
  id,
  selectionColor,
}: Props) {
  const { x, y, width, height, fill } = layer;

  const form = useForm<FormSchema>({
    defaultValues: {
      url: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <foreignObject
        x={0}
        y={0}
        width={width}
        height={height}
        style={{
          transform: `translate(${x}px, ${y}px)`,
          backgroundColor: fill ? colorToCss(fill) : "#CCC",
          border: "1px solid",
          borderColor: selectionColor || "transparent",
        }}
        onPointerDown={(e) => onPointerDown(e, id)}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Youtube Link</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" /> Add Video
            </Button>
          </form>
        </Form>
      </foreignObject>
    </>
  );
}
