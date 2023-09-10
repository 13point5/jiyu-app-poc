import { DocumentLayer } from "@/app/HardWay/types";

import { Viewer } from "@react-pdf-viewer/core";

import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./Document.css";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  layer: DocumentLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
};

export default function Document({ layer, onPointerDown, id }: Props) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { data } = layer;
  console.log("id", id);
  console.log("data", data);

  if (!data) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center h-full w-full bg-red-100">
        <Button>Choose Document</Button>
        <Button>Upload Document</Button>
      </div>
    );
  }

  return (
    <Viewer
      fileUrl="/Learning_Theories_ Cognitivism.pdf"
      defaultScale={1}
      plugins={[defaultLayoutPluginInstance]}
    />
  );
}
