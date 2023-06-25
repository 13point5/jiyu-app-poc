import suggestion from "@/components/at-mention";
import { Mention } from "@/components/at-mention/Renderer";
import StarterKit from "@tiptap/starter-kit";

const editorConfig = {
  extensions: [
    StarterKit,
    Mention.configure({
      HTMLAttributes: {
        class: "p-1 rounded-sm",
      },
      suggestion,
    }),
  ],
  editorProps: {
    attributes: {
      class:
        "h-full w-full prose prose-sm focus:outline-none text-inherit bg-white",
    },
  },
};

export default editorConfig;
