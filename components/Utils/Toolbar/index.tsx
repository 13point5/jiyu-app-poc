import React from "react";
import { CanvasMode, LayerType, CanvasState } from "@/app/Canvas/src/types";
import IconButton from "@/components/ui/IconButton";
import {
  Circle,
  FileText,
  MousePointer,
  Pencil,
  Square,
  X,
  Youtube,
} from "lucide-react";

type Props = {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  clearCanvas: () => void;
};

export default function ToolsBar({
  canvasState,
  setCanvasState,
  clearCanvas,
}: Props) {
  return (
    <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center">
      <div className="border-2 border-slate-300 rounded-md flex items-center justify-center">
        <div className="flex gap-2 items-center justify-center p-3">
          <IconButton
            isActive={
              canvasState.mode === CanvasMode.None ||
              canvasState.mode === CanvasMode.Translating ||
              canvasState.mode === CanvasMode.SelectionNet ||
              canvasState.mode === CanvasMode.Pressing ||
              canvasState.mode === CanvasMode.Resizing
            }
            onClick={() => setCanvasState({ mode: CanvasMode.None })}
          >
            <MousePointer />
          </IconButton>

          <IconButton
            isActive={canvasState.mode === CanvasMode.Pencil}
            onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
          >
            <Pencil />
          </IconButton>

          <IconButton
            isActive={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Youtube
            }
            onClick={() => {
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Youtube,
              });
            }}
          >
            <Youtube />
          </IconButton>

          <IconButton
            isActive={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Document
            }
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Document,
              })
            }
          >
            <FileText />
          </IconButton>

          <IconButton
            isActive={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Rectangle
            }
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Rectangle,
              })
            }
          >
            <Square />
          </IconButton>

          <IconButton
            isActive={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Ellipse
            }
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Ellipse,
              })
            }
          >
            <Circle />
          </IconButton>

          <IconButton onClick={clearCanvas}>
            <X />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
