import { memo } from "react";
import useSelectionBounds from "@/app/HardWay/hooks/useSelectionBounds";
import { LayerType, Side, XYWH } from "@/app/HardWay/types";
import { useCanvasStore } from "@/app/HardWay/store";

type SelectionBoxProps = {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
};

const HANDLE_WIDTH = 8;

const SelectionBox = ({ onResizeHandlePointerDown }: SelectionBoxProps) => {
  // We should show resize handles if exactly one shape is selected and it's
  // not a path layer
  // const soleLayerId = useSelf((me) =>
  //   me.presence.selection.length === 1 ? me.presence.selection[0] : null
  // );

  // const isShowingHandles = useStorage(
  //   (root) =>
  //     soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
  // );

  const isShowingHandles = useCanvasStore((state) => {
    const selectedLayers = state.presence.selection;
    if (selectedLayers.length !== 1) {
      return false;
    }
    const layer = state.layers.get(selectedLayers[0]);
    return layer?.type !== LayerType.Path;
  });

  const bounds = useSelectionBounds();
  if (!bounds) {
    return null;
  }

  return (
    <>
      <rect
        className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
        style={{
          transform: `translate(${bounds.x}px, ${bounds.y}px)`,
        }}
        x={0}
        y={0}
        width={bounds.width}
        height={bounds.height}
      />
      {isShowingHandles && (
        <>
          <rect
            className="selection_handle"
            x={0}
            y={0}
            style={{
              cursor: "nwse-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${
                bounds.y - HANDLE_WIDTH / 2
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Top + Side.Left, bounds);
            }}
          />
          <rect
            className="selection_handle"
            x={0}
            y={0}
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${
                bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2
              }px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Top, bounds);
            }}
          />
          <rect
            className="selection_handle"
            x={0}
            y={0}
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${
                bounds.x - HANDLE_WIDTH / 2 + bounds.width
              }px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Top + Side.Right, bounds);
            }}
          />
          <rect
            className="selection_handle"
            x={0}
            y={0}
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${
                bounds.x - HANDLE_WIDTH / 2 + bounds.width
              }px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Right, bounds);
            }}
          />
          <rect
            className="selection_handle"
            x={0}
            y={0}
            style={{
              cursor: "nwse-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${
                bounds.x - HANDLE_WIDTH / 2 + bounds.width
              }px, ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds);
            }}
          />
          <rect
            className="selection_handle"
            x={0}
            y={0}
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${
                bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2
              }px, ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Bottom, bounds);
            }}
          />
          <rect
            className="selection_handle"
            x={0}
            y={0}
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${
                bounds.y - HANDLE_WIDTH / 2 + bounds.height
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds);
            }}
          />
          <rect
            className="selection_handle"
            x={0}
            y={0}
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${
                bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2
              }px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Left, bounds);
            }}
          />
        </>
      )}
    </>
  );
};

SelectionBox.displayName = "SelectionBox";
export default SelectionBox;
