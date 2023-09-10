import { RectangleLayer } from "@/app/HardWay/types";
import { colorToCss } from "@/app/HardWay/utils";

type Props = {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
};

export default function Rectangle({
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
          backgroundColor: fill ? colorToCss(fill) : "#CCC",
          border: "1px solid",
          borderColor: selectionColor || "transparent",
        }}
        className="p-2"
        onPointerDown={(e) => onPointerDown(e, id)}
      >
        <textarea
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            outline: "none",
          }}
        />
      </foreignObject>
    </>
  );
}
