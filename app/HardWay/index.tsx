import React, {
  PointerEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";
import {
  Color,
  CanvasState,
  CanvasMode,
  Camera,
  Side,
  XYWH,
  Point,
  BlockLayerType,
} from "./types";
import {
  colorToCss,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "./utils";
import SelectionBox from "@/components/Utils/SelectionBox";
import { nanoid } from "nanoid";
import LayerComponent from "@/components/Layers/LayerComponent";
import SelectionTools from "@/components/Utils/SelectionTools";
import useDisableScrollBounce from "./hooks/useDisableScrollBounce";
import Path from "@/components/Utils/Path";
import Toolbar from "@/components/Utils/Toolbar";
import { DEFAULT_BLOCK_DIMS } from "./constants";
import { useCanvasStore } from "./store";

import { Inter } from "next/font/google";
import { isCursorInsideALayer } from "@/app/HardWay/lib/utils";
const inter = Inter({ subsets: ["latin"] });

function Canvas() {
  const [canvasState, setState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  console.log("canvasState", canvasState);

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 252,
    g: 142,
    b: 42,
  });

  useDisableScrollBounce();

  const layers = useCanvasStore((state) => state.layers);
  const layerIds = useCanvasStore((state) => state.layerIds);
  const pencilDraft = useCanvasStore((state) => state.presence.pencilDraft);
  const setPencilDraft = useCanvasStore((state) => state.setPencilDraft);

  const deleteLayers = useCanvasStore((state) => state.deleteSelectedLayers);
  const selection = useCanvasStore((state) => state.presence.selection);
  const setLayerSelection = useCanvasStore((state) => state.setLayerSelection);
  const unselectLayers = useCanvasStore((state) => state.unselectLayers);
  const handleInsertLayer = useCanvasStore((state) => state.insertLayer);
  const setMyPresence = useCanvasStore((state) => state.setMyPresence);
  const setMyCursor = useCanvasStore((state) => state.setMyCursor);
  const clearCanvas = useCanvasStore((state) => state.clearCanvas);
  const handleTranslateSelectedLayers = useCanvasStore(
    (state) => state.translateSelectedLayers
  );
  const handleResizeFirstSelectedLayer = useCanvasStore(
    (state) => state.resizeFirstSelectedLayer
  );
  const handleStartDrawing = useCanvasStore((state) => state.startDrawing);
  const handleContinueDrawing = useCanvasStore(
    (state) => state.continueDrawing
  );
  const updateSelectionNet = useCanvasStore(
    (state) => state.updateSelectionNet
  );

  /**
   * Hook used to listen to Undo / Redo and delete selected layers
   */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        // case "Backspace": {
        //   deleteLayers();
        //   break;
        // }

        case "Escape": {
          unselectLayers();
          break;
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteLayers, unselectLayers]);

  /**
   * Select the layer if not already selected and start translating the selection
   */
  const onLayerPointerDown = useCallback(
    (e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);

      if (!selection.includes(layerId)) {
        setLayerSelection(layerId);
      }
      setState({ mode: CanvasMode.Translating, current: point });
    },
    [setState, camera, canvasState.mode, selection, setLayerSelection]
  );

  /**
   * Start resizing the layer
   */
  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      setState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    []
  );

  /**
   * Insert an ellipse or a rectangle at the given position and select it
   */
  const insertLayer = useCallback(
    (layerType: BlockLayerType, position: Point) => {
      const layerId = nanoid();

      const { height, width } = DEFAULT_BLOCK_DIMS[layerType] || {
        height: 100,
        width: 100,
      };

      const layer = {
        type: layerType,
        x: position.x,
        y: position.y,
        height,
        width,
        fill: lastUsedColor,
        data: null,
      };

      handleInsertLayer(layerId, layer);
      setMyPresence([layerId]);
      setState({ mode: CanvasMode.None });
    },
    [handleInsertLayer, lastUsedColor, setMyPresence]
  );

  /**
   * Transform the drawing of the current user in a layer and reset the presence to delete the draft.
   */
  const insertPath = useCallback(() => {
    if (pencilDraft == null || pencilDraft.length < 2) {
      setPencilDraft(null);
      return;
    }

    handleInsertLayer(
      nanoid(),
      penPointsToPathLayer(pencilDraft, lastUsedColor)
    );

    setPencilDraft(null);
    setState({ mode: CanvasMode.Pencil });
  }, [handleInsertLayer, lastUsedColor, pencilDraft, setPencilDraft]);

  /**
   * Move selected layers on the canvas
   */
  const translateSelectedLayers = useCallback(
    (point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      handleTranslateSelectedLayers(offset);

      setState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState, handleTranslateSelectedLayers]
  );

  /**
   * Resize selected layer. Only resizing a single layer is allowed.
   */
  const resizeSelectedLayer = useCallback(
    (point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      handleResizeFirstSelectedLayer(bounds);
    },
    [canvasState, handleResizeFirstSelectedLayer]
  );

  /**
   * Insert the first path point and start drawing with the pencil
   */
  const startDrawing = useCallback(
    (point: Point, pressure: number) => {
      handleStartDrawing(point, pressure, lastUsedColor);
    },
    [handleStartDrawing, lastUsedColor]
  );

  /**
   * Continue the drawing and send the current draft to other users in the room
   */
  const continueDrawing = useCallback(
    (point: Point, e: React.PointerEvent) => {
      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      handleContinueDrawing(
        point,

        pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
          ? pencilDraft
          : [...pencilDraft, [point.x, point.y, e.pressure]]
      );
    },
    [canvasState.mode, handleContinueDrawing, pencilDraft]
  );

  /**
   * Start multiselection with the selection net if the pointer move enough since pressed
   */
  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    // If the distance between the pointer position and the pointer position when it was pressed
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      // Start multi selection
      setState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const current = pointerEventToCanvasPoint(e, camera);

      if (!isCursorInsideALayer({ cursor: current, layers })) {
        // Pan the camera based on the wheel delta
        setCamera((camera) => ({
          x: camera.x - e.deltaX,
          y: camera.y - e.deltaY,
        }));
      }
    },
    [camera, layers]
  );

  const onPointerDown: PointerEventHandler = useCallback(
    (e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, setState, startDrawing]
  );

  const onPointerMove: PointerEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }
      setMyCursor(current);
    },
    [
      camera,
      canvasState,
      continueDrawing,
      resizeSelectedLayer,
      setMyCursor,
      startMultiSelection,
      translateSelectedLayers,
      updateSelectionNet,
    ]
  );

  const onPointerLeave: PointerEventHandler = useCallback(
    () => setMyCursor(null),
    [setMyCursor]
  );

  const onPointerUp: PointerEventHandler = useCallback(
    (e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setState({
          mode: CanvasMode.None,
        });
      }
    },
    [camera, canvasState, insertLayer, insertPath, setState, unselectLayers]
  );

  return (
    <>
      <div className="bg-[#F1F6F8] touch-none">
        <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />

        <svg
          className={`${inter.className} w-screen h-screen`}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerUp={onPointerUp}
        >
          <g
            style={{
              transform: `translate(${camera.x}px, ${camera.y}px)`,
            }}
          >
            {layerIds.map((layerId) => (
              <LayerComponent
                key={layerId}
                id={layerId}
                mode={canvasState.mode}
                onLayerPointerDown={onLayerPointerDown}
              />
            ))}

            {/* Blue square that show the selection of the current users. Also contains the resize handles. */}
            <SelectionBox
              onResizeHandlePointerDown={onResizeHandlePointerDown}
            />

            {/* Selection net that appears when the user is selecting multiple layers at once */}
            {canvasState.mode === CanvasMode.SelectionNet &&
              canvasState.current != null && (
                <rect
                  className="fill-[#0044ff] opacity-5 stroke-[#0044ff] stroke-[0.5]"
                  x={Math.min(canvasState.origin.x, canvasState.current.x)}
                  y={Math.min(canvasState.origin.y, canvasState.current.y)}
                  width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                  height={Math.abs(
                    canvasState.origin.y - canvasState.current.y
                  )}
                />
              )}

            {/* Drawing in progress. Still not commited to the storage. */}
            {pencilDraft != null && pencilDraft.length > 0 && (
              <Path
                points={pencilDraft}
                fill={colorToCss(lastUsedColor)}
                x={0}
                y={0}
              />
            )}
          </g>
        </svg>
      </div>

      <Toolbar
        canvasState={canvasState}
        setCanvasState={setState}
        clearCanvas={clearCanvas}
      />
    </>
  );
}

export default Canvas;
