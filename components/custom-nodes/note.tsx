import { memo } from "react";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes } from "@/app/constants";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function NoteNode({ type, data, ...restProps }: { type: CustomNodeTypes }) {
  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: "h-full w-full prose prose-sm focus:outline-none",
      },
    },
    // content: "<p>Hello World! 🌎️</p>",
  });

  return (
    <CustomNodeContainer type={type} title={data.name}>
      <EditorContent
        style={{
          height: "200px",
        }}
        editor={editor}
        placeholder="Take your notes here..."
      />
    </CustomNodeContainer>
  );
}

export default memo(NoteNode);
