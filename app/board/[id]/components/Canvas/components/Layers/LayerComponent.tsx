import React from "react";
import Ellipse from "./Ellipse";
import Path from "../../../../../../../components/Utils/Path";
import Rectangle from "./Rectangle";
import {
  CanvasMode,
  LayerType,
} from "@/app/board/[id]/components/Canvas/types";
import { colorToCss } from "@/app/board/[id]/components/Canvas/utils";
import Document from "./Document";
import YoutubeBlock from "./Youtube";
import { useCanvasStore } from "@/app/board/[id]/components/Canvas/store";

type Props = {
  id: string;
  mode: CanvasMode;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

const LayerComponent = ({ onLayerPointerDown, id, selectionColor }: Props) => {
  const layer = useCanvasStore((state) => state.layers.get(String(id)));

  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.Document:
      return (
        <Document
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );

    case LayerType.Ellipse:
      return (
        <Ellipse
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );

    case LayerType.Path:
      return (
        <Path
          key={id}
          points={layer.points}
          onPointerDown={(e) => onLayerPointerDown(e, id)}
          x={layer.x}
          y={layer.y}
          fill={layer.fill ? colorToCss(layer.fill) : "#CCC"}
          stroke={selectionColor}
        />
      );

    case LayerType.Rectangle:
      return (
        <Rectangle
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );

    default:
      console.warn("Unknown layer type");
      return null;
  }
};

LayerComponent.displayName = "LayerComponent";

export default LayerComponent;
