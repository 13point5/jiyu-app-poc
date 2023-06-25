import * as R from "ramda";
import { memo } from "react";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes } from "@/app/constants";

import { useEditor, EditorContent } from "@tiptap/react";
import editorConfig from "@/app/tiptapConfig";

const noteConfig = R.mergeDeepRight(editorConfig, {
  editorProps: {
    attributes: {
      class: "h-full w-full prose prose-sm focus:outline-none bg-transparent",
    },
  },
});

function NoteNode({ type, data, ...restProps }: { type: CustomNodeTypes }) {
  const editor = useEditor(noteConfig);

  return (
    <CustomNodeContainer type={type} title={data.name}>
      <EditorContent
        autoFocus
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
