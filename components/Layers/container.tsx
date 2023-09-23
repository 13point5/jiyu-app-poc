import {
  defaultNames,
  icons,
} from "@/app/board/[id]/components/Canvas/constants";

import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/app/board/[id]/components/Canvas/store";
import { colorToCss } from "@/app/board/[id]/components/Canvas/utils";
import { DocumentLayer } from "@/app/board/[id]/components/Canvas/types";

type Props = {
  id: string;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  children: React.ReactNode;

  className?: string;
};

const CustomNodeContainer = ({
  id,
  onPointerDown,
  children,
  className = "",
}: Props) => {
  const layer = useCanvasStore((state) => state.layers.get(id)) as
    | DocumentLayer
    | null
    | undefined;

  if (!layer) {
    return null;
  }

  const { x, y, width, height, fill, data, type } = layer;
  const fillHexCode = colorToCss(fill);

  const Icon = icons[type];

  return (
    <foreignObject
      x={0}
      y={0}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        width,
        height,
      }}
      className={cn(
        "rounded-md flex flex-col drop-shadow-md bg-white",
        className
      )}
    >
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          onPointerDown={(e) => onPointerDown(e, id)}
          className="flex flex-row gap-2 p-2"
          style={{
            backgroundColor: "#F7FAFC",
            borderTop: "4px solid",
            borderColor: fillHexCode,
          }}
        >
          <Icon size={24} />

          <p>{data?.name || defaultNames[type]}</p>
        </div>

        {children}
      </div>
    </foreignObject>
  );
};

export default CustomNodeContainer;
