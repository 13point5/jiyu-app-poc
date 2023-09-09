import { DocumentLayer } from "@/app/Canvas/src/types";

import { Viewer } from "@react-pdf-viewer/core";

import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./Document.css";

import { FileText } from "lucide-react";
import { colorToCss } from "@/app/Canvas/src/utils";

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
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
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
          border: "1.35px solid",
          borderColor: colorToCss(fill),
        }}
        onPointerDown={(e) => onPointerDown(e, id)}
        className="rounded-md flex flex-col"
      >
        <div
          className="flex flex-row gap-2 p-2"
          style={{
            backgroundColor: colorToCss(fill),
          }}
        >
          <FileText size={24} />

          <p>Cognitivism</p>
        </div>

        <Viewer
          fileUrl="/Learning_Theories_ Cognitivism.pdf"
          defaultScale={1}
          plugins={[defaultLayoutPluginInstance]}
        />
      </foreignObject>
    </>
  );
}
