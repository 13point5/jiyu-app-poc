import * as R from "ramda";
import { memo, useState } from "react";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes } from "@/app/constants";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import editorConfig from "@/app/tiptapConfig";

const noteConfig = R.mergeDeepRight(editorConfig, {
  editorProps: {
    attributes: {
      class: "h-full w-full prose prose-sm focus:outline-none bg-transparent",
    },
  },
});

function replaceSpanTags(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const spans = doc.getElementsByTagName("span");

  for (let i = spans.length - 1; i >= 0; i--) {
    const span = spans[i];
    const dataType = span.getAttribute("data-type");
    const dataId = span.getAttribute("data-id");

    if (dataType === "mention" && dataId) {
      const blockId = `<@block:${dataId}>`;
      const newElement = doc.createTextNode(blockId);
      span.parentNode?.replaceChild(newElement, span);
    }
  }

  return doc.body.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function restoreSpanTags(
  html: string,
  getClass: (blockId: string) => string,
  getDataLabel: (blockId: string) => string
): string {
  const blockIdRegex = /<@block:(.*?)>/g;
  const restoredHtml = html.replace(blockIdRegex, (_, blockId) => {
    const cssClass = getClass(blockId);
    const dataLabel = getDataLabel(blockId);
    return `<span data-type="mention" class="${cssClass}" data-id="${blockId}" data-label="${dataLabel}"></span>`;
  });

  return restoredHtml;
}

function NoteNode({ type, data, ...restProps }: { type: CustomNodeTypes }) {
  // console.log("noteConfig", noteConfig);

  const [htmlContent, setHtmlContent] = useState("");
  const [jsonContent, setJsonContent] = useState();

  // console.log("htmlContent", htmlContent);
  const editor = useEditor({
    ...noteConfig,

    onUpdate: ({ editor }) => {
      console.log({
        htmlContent,
        newHtml: editor.getHTML(),
        jsonContent,
        newJSON: editor.getJSON(),
      });
      // console.log(editor.getHTML());
      setHtmlContent(editor.getHTML());
      setJsonContent(editor.getJSON());
    },
    // extensions: [StarterKit],
    // editorProps: {
    //   attributes: {
    //     class: "h-full w-full prose prose-sm focus:outline-none",
    //   },
    // },
    // content: "<p>Hello World! 🌎️</p>",
  });

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
