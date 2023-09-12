import { defaultNames, icons } from "@/app/HardWay/constants";

import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/app/HardWay/store";
import { colorToCss } from "@/app/HardWay/utils";
import { DocumentLayer } from "@/app/HardWay/types";

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
        border: "1.35px solid",
        borderColor: fillHexCode,
        width,
        height,
      }}
      onPointerDown={(e) => onPointerDown(e, id)}
      className={cn("rounded-md flex flex-col", className)}
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
          className="flex flex-row gap-2 p-2"
          style={{
            backgroundColor: fillHexCode,
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