import { memo } from "react";
import { ArrowBigUpDash, ArrowBigDownDash, Trash2 } from "lucide-react";
import ColorPicker from "./ColorPicker";
import IconButton from "@/components/ui/IconButton";
import { Camera, Color } from "@/app/board/[id]/components/HardWay/types";
import useSelectionBounds from "@/app/board/[id]/components/HardWay/hooks/useSelectionBounds";
import { useCanvasStore } from "@/app/board/[id]/components/HardWay/store";

type SelectionToolsProps = {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
};

function SelectionTools({ camera, setLastUsedColor }: SelectionToolsProps) {
  const setFill = useCanvasStore((state) => state.setFill);
  const moveToFront = useCanvasStore((state) => state.moveToFront);
  const moveToBack = useCanvasStore((state) => state.moveToBack);

  const deleteLayers = useCanvasStore((state) => state.deleteSelectedLayers);

  const selectionBounds = useSelectionBounds();
  if (!selectionBounds) {
    return null;
  }

  const handleSetFill = (fill: Color) => {
    setLastUsedColor(fill);
    setFill(fill);
  };

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
  const y = selectionBounds.y + camera.y;
  return (
    <div
      className="absolute rounded-md shadow-md flex divide-x bg-white select-none"
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
      }}
    >
      <ColorPicker onChange={handleSetFill} />

      <div className="p-3 flex items-center justify-center">
        <IconButton onClick={moveToFront}>
          <ArrowBigUpDash />
        </IconButton>
        <IconButton onClick={moveToBack}>
          <ArrowBigDownDash />
        </IconButton>
        <IconButton onClick={deleteLayers}>
          <Trash2 />
        </IconButton>
      </div>
    </div>
  );
}

export default memo(SelectionTools);
