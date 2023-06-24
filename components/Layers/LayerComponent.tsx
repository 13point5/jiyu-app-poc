import React, { memo } from "react";
import Ellipse from "./Ellipse";
import Path from "../Utils/Path";
import Rectangle from "./Rectangle";
import { CanvasMode, LayerType } from "@/app/Canvas/src/types";
import { colorToCss } from "@/app/Canvas/src/utils";
import Document from "./Document";
import YoutubeBlock from "./Youtube";
import { useCanvasStore } from "@/app/Canvas/src/store";

type Props = {
  id: string;
  mode: CanvasMode;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

const LayerComponent = memo(
  ({ onLayerPointerDown, id, selectionColor }: Props) => {
    const layer = useCanvasStore((state) => state.layers.get(id));
    if (!layer) {
      return null;
    }

    switch (layer.type) {
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

      case LayerType.Document:
        return (
          <Document
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );

      case LayerType.Youtube:
        return (
          <YoutubeBlock
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
  }
);

LayerComponent.displayName = "LayerComponent";

export default LayerComponent;