import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DocumentLayer, LayerType } from "@/app/HardWay/types";

import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import "./Document.css";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";

import CustomLayerContainer from "./container";
import { useCanvasStore } from "@/app/HardWay/store";
import { DEFAULT_BLOCK_DIMS } from "@/app/HardWay/constants";

type Props = {
  id: string;
  layer: DocumentLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
};

export default function Document({ layer, onPointerDown, id }: Props) {
  const { updateLayer } = useCanvasStore();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { data } = layer;

  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log("acceptedFiles", acceptedFiles);

    setFile(acceptedFiles[0]);
  }, []);

  const handleUpload = () => {
    updateLayer({
      id,
      layer: {
        data: {
          path: "",
        },
        width: 700,
        height: 800,
      },
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  useEffect(() => {
    if (!data && file) {
      updateLayer({
        id,
        layer: {
          height: 150,
        },
      });
    }
  }, [file, data, id, updateLayer]);

  if (!data) {
    return (
      <CustomLayerContainer id={id} onPointerDown={onPointerDown}>
        <div className="h-full w-full">
          {!file && (
            <div
              {...getRootProps()}
              className="flex items-center justify-center h-full w-full p-2"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <Button variant="link">
                  Drag and drop files here, or click to browse
                </Button>
              )}
            </div>
          )}

          {file && (
            <div className="flex flex-col gap-2 p-2">
              <div className="flex gap-2 w-full items-center justify-between">
                <p className="text-sm">{file.name}</p>

                <Button variant="ghost" size="icon-sm">
                  <X size={16} />
                </Button>
              </div>

              <Button onClick={handleUpload}>Upload and Process</Button>
            </div>
          )}
        </div>
      </CustomLayerContainer>
    );
  }

  return (
    <CustomLayerContainer id={id} onPointerDown={onPointerDown}>
      <Viewer
        fileUrl="/Learning_Theories_ Cognitivism.pdf"
        defaultScale={1}
        plugins={[defaultLayoutPluginInstance]}
      />
    </CustomLayerContainer>
  );
}
