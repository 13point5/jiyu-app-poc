import React, { memo } from "react";
import Ellipse from "./Ellipse";
import Path from "../Utils/Path";
import Rectangle from "./Rectangle";
import { CanvasMode, LayerType } from "@/app/HardWay/types";
import { colorToCss } from "@/app/HardWay/utils";
import Document from "./Document";
import YoutubeBlock from "./Youtube";
import CustomLayerContainer from "./container";
import { useCanvasStore } from "@/app/HardWay/store";

const customLayerComponent = Object.freeze({
  [LayerType.Document]: Document,
  [LayerType.Youtube]: YoutubeBlock,
});

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

    // if ([LayerType.Document, LayerType.Youtube].includes(layer.type)) {
    //   const Layer = customLayerComponent[layer.type];

    //   return (
    //     <CustomLayerContainer id={id} onPointerDown={onLayerPointerDown}>
    //       <Layer
    //         id={id}
    //         layer={layer}
    //         onPointerDown={onLayerPointerDown}
    //         selectionColor={selectionColor}
    //       />
    //     </CustomLayerContainer>
    //   );
    // }

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
  }
);

LayerComponent.displayName = "LayerComponent";

export default LayerComponent;
