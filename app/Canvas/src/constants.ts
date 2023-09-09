import { BlockLayerType, LayerType } from "./types";

export const DEFAULT_BLOCK_DIMS: {
  [key in BlockLayerType]: {
    width: number;
    height: number;
  };
} = {
  [LayerType.Youtube]: {
    width: 300,
    height: 200,
  },
  [LayerType.Document]: {
    width: 680,
    height: 800,
  },
  [LayerType.Rectangle]: {
    width: 300,
    height: 200,
  },
  [LayerType.Ellipse]: {
    width: 300,
    height: 200,
  },
};
