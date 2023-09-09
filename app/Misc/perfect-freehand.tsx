import { useState } from "react";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "../utils";

const DrawingApp = () => {
  const [points, setPoints] = useState([]);

  console.log("points", points);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setPoints((prev) => [...prev, [e.pageX, e.pageY, e.pressure]]);
  }

  function handlePointerMove(e) {
    if (e.buttons !== 1) return;
    setPoints((prev) => [...prev, [e.pageX, e.pageY, e.pressure]]);
  }

  const stroke = getStroke(points, {
    size: 16,
    // thinning: 0.5,
    // smoothing: 0.5,
    // streamline: 0.5,
  });

  const pathData = getSvgPathFromStroke(stroke);

  return (
    <div className="border-4 border-sky-300 w-screen h-screen">
      <svg
        className="fixed top-0 left-0 w-full h-full bg-white"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        {points && <path d={pathData} />}
      </svg>
    </div>
  );
};

export default DrawingApp;
