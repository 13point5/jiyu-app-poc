import { BlockLayerType, LayerType } from "./types";
import {
  FileText,
  Globe,
  MessagesSquare,
  Pencil,
  Shapes,
  StickyNote,
  Youtube,
} from "lucide-react";

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
    width: 350,
    height: 120,
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

export const icons = {
  [LayerType.Document]: FileText,
  [LayerType.Youtube]: Youtube,
  [LayerType.Rectangle]: Shapes,
  [LayerType.Ellipse]: Shapes,
  [LayerType.Path]: Pencil,
};

export const defaultNames = {
  [LayerType.Document]: "Document",
  [LayerType.Youtube]: "Video",
  [LayerType.Rectangle]: "Rectangle",
  [LayerType.Ellipse]: "Ellipse",
  [LayerType.Path]: "Path",
};
