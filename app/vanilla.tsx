import * as React from "react";
import { Stage, Layer, Line, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

type LineType = {
  tool: string;
  points: number[];
};

const VanillaApp = () => {
  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState<LineType[]>([]);
  const isDrawing = React.useRef(false);

  console.log("lines", lines);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target?.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    isDrawing.current = true;
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          <Text text="Just start drawing" x={5} y={30} />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
    </div>
  );
};

export default VanillaApp;
