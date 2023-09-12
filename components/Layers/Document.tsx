import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
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
  // console.log("id", id);
  // console.log("data", data);

  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log("acceptedFiles", acceptedFiles);

    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  if (!data) {
    return (
      <div className="bg-red-100 h-full w-full">
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

        <div className="flex flex-col gap-2 p-2">
          {file && <p>{file.name}</p>}

          {file && <Button>Upload and Process</Button>}
        </div>
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
