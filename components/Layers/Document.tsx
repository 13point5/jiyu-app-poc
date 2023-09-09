import { DocumentLayer } from "@/app/Canvas/src/types";
import { colorToCss } from "@/app/Canvas/src/utils";

import { CustomNodeTypes } from "@/app/constants";
import PDFNode from "@/components/custom-nodes/pdf";

import { Document as PDFDoc, Page } from "react-pdf";
import CustomNodeContainer from "@/components/custom-nodes/container";

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
          // backgroundColor: fill ? colorToCss(fill) : "#CCC",
          // border: "1px solid",
          // borderColor: selectionColor || "transparent",
        }}
        onPointerDown={(e) => onPointerDown(e, id)}
      >
        <CustomNodeContainer
          type={CustomNodeTypes.PDF}
          title="Cognitivism"
          className={`w-[${width}px]`}
        >
          <PDFDoc file="/Learning_Theories_ Cognitivism.pdf">
            <Page pageNumber={1} width={width - 32} />
          </PDFDoc>
        </CustomNodeContainer>
      </foreignObject>
    </>
  );
}
