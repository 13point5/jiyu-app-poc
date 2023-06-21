import { memo } from "react";
import {
  Handle,
  Position,
  NodeResizer,
  OnResize,
  OnResizeStart,
  useStore,
} from "reactflow";
import { Document, Page } from "react-pdf";
import { FileText } from "lucide-react";

function PDFNode({
  id,
  data,
  selected,
  ...restProps
}: {
  data: {
    path: string;
    selected: boolean;
  };
}) {
  const size = useStore((s) => {
    const node = s.nodeInternals.get(id);
    console.log("node", node);

    return {
      width: node.width,
      height: node.height,
    };
  });
  console.log("size", size);

  console.log("restProps", restProps);
  const onResize: OnResize = (event, params) => {
    console.log("event, params", event, params);
  };

  const onResizeStart: OnResizeStart = (event, params) => {
    console.log("onResizeStart event, params", event, params);
  };

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
        onResize={onResize}
        onResizeStart={onResizeStart}
        keepAspectRatio
      />
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-md">
        <div className="flex flex-row gap-2 align-middle">
          <FileText />

          <p className="">{data.path}</p>
        </div>

        <Document
          file={data.path}
          style={{
            width: `${size.width - 50}px`,
            height: `${size.height - 50}px`,
          }}
        >
          <Page pageNumber={1} />
        </Document>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}

export default memo(PDFNode);
