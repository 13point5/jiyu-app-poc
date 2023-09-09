import { DocumentLayer } from "@/app/Canvas/src/types";

import { CustomNodeTypes } from "@/app/constants";

import { Document as PDFDoc, Page } from "react-pdf";
import CustomNodeContainer from "@/components/custom-nodes/container";

import { Worker, Viewer } from "@react-pdf-viewer/core";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";

type Props = {
  id: string;
  layer: DocumentLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
};

export default function Document({
  layer,
  onPointerDown,
  id,
  selectionColor,
}: Props) {
  const { x, y, width, height, fill } = layer;

  return (
    <>
      <foreignObject
        x={0}
        y={0}
        width={width}
        height={height}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        onPointerDown={(e) => onPointerDown(e, id)}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl="/Learning_Theories_ Cognitivism.pdf" />;
        </Worker>

        {/* <CustomNodeContainer
          type={CustomNodeTypes.PDF}
          title="Cognitivism"
          className={`w-[${width}px]`}
        >
          <PDFDoc file="/Learning_Theories_ Cognitivism.pdf">
            <Page pageNumber={1} width={width - 32} />
          </PDFDoc>
        </CustomNodeContainer> */}
      </foreignObject>
    </>
  );
}
