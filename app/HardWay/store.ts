import * as R from "ramda";
import { Layer, Point, Color, XYWH } from "./types";
import { findIntersectingLayersWithRectangle } from "./utils";
import { create } from "zustand";

export type LayerId = string;

type PencilDraft = [x: number, y: number, pressure: number][] | null;

type Presence = {
  selection: string[];
  cursor: Point | null;
  pencilDraft: PencilDraft;
  penColor: Color | null;
};

type State = {
  layerIds: LayerId[];
  layers: Map<LayerId, Layer>;

  presence: Presence;
};

type Actions = {
  setLayerSelection: (id: LayerId) => void;
  unselectLayers: () => void;

  setMyPresence: (layerIds: Presence["selection"]) => void;

  setMyCursor: (cursor: Presence["cursor"]) => void;

  setPencilDraft: (newDraft: PencilDraft) => void;

  startDrawing: (
    point: Point,
    pressure: number,
    penColor: Presence["penColor"]
  ) => void;

  continueDrawing: (
    cursor: Presence["cursor"],
    pencilDraft: Presence["pencilDraft"]
  ) => void;

  insertLayer: (layerId: LayerId, layer: Layer) => void;
  deleteLayer: (layerId: LayerId) => void;
  deleteSelectedLayers: () => void;
  updateLayer: (params: { id: LayerId; layer: Partial<Layer> }) => void;

  translateSelectedLayers: (delta: Point) => void;
  resizeFirstSelectedLayer: (bounds: XYWH) => void;

  updateSelectionNet: (current: Point, origin: Point) => void;

  moveToFront: () => void;
  moveToBack: () => void;

  setFill: (fill: Color) => void;

  clearCanvas: () => void;
};

const initialState: State = {
  layerIds: [],
  layers: new Map(),

  presence: {
    selection: [],
    cursor: null,
    pencilDraft: null,
    penColor: null,
  },
};

export const useCanvasStore = create<State & Actions>((set, get) => ({
  ...initialState,

  setLayerSelection: (id) =>
    set((state) => ({
      ...state,
      presence: {
        ...state.presence,
        selection: [id],
      },
    })),

  unselectLayers: () =>
    set((state) => ({
      ...state,
      presence: {
        ...state.presence,
        selection: [],
      },
    })),

  setMyPresence: (layerIds) =>
    set((state) => ({
      ...state,
      presence: {
        ...state.presence,
        selection: layerIds,
      },
    })),

  setMyCursor: (cursor) =>
    set((state) => ({
      ...state,
      presence: {
        ...state.presence,
        cursor,
      },
    })),

  setPencilDraft: (newDraft) =>
    set((state) => ({
      ...state,
      presence: {
        ...state.presence,
        pencilDraft: newDraft,
      },
    })),

  startDrawing: (point, pressure, penColor) =>
    set((state) => ({
      ...state,
      presence: {
        ...state.presence,
        pencilDraft: [[point.x, point.y, pressure]],
        penColor,
      },
    })),

  continueDrawing: (cursor, pencilDraft) =>
    set((state) => ({
      ...state,
      presence: {
        ...state.presence,
        cursor,
        pencilDraft,
      },
    })),

  insertLayer: (layerId, layer) =>
    set((state) => ({
      ...state,
      layerIds: [...state.layerIds, layerId],
      layers: new Map(state.layers).set(layerId, layer),
    })),

  deleteLayer: (layerId) =>
    set((state) => {
      const updatedLayers = new Map(state.layers);
      updatedLayers.delete(layerId);

      return {
        ...state,
        layerIds: state.layerIds.filter((id) => id !== layerId),
        layers: updatedLayers,
      };
    }),

  deleteSelectedLayers: () =>
    set((state) => {
      const selection = state.presence.selection;

      const updatedLayers = new Map(state.layers);
      selection.forEach((layerId) => {
        updatedLayers.delete(layerId);
      });

      return {
        ...state,
        layerIds: state.layerIds.filter((id) => !selection.includes(id)),
        layers: updatedLayers,
        presence: {
          ...state.presence,
          selection: [],
        },
      };
    }),

  translateSelectedLayers: (delta) =>
    set((state) => {
      const selection = state.presence.selection;

      const updatedLayers = new Map(state.layers);
      selection.forEach((layerId) => {
        const layer = updatedLayers.get(layerId);
        if (!layer) return;

        layer.x += delta.x;
        layer.y += delta.y;
      });

      return {
        ...state,
        layers: updatedLayers,
      };
    }),

  resizeFirstSelectedLayer: (bounds: XYWH) =>
    set((state) => {
      const layerId = state.presence.selection[0];
      if (!layerId) return state;

      const layer = state.layers.get(layerId);
      if (!layer) return state;

      const updatedLayers = new Map(state.layers);
      updatedLayers.set(layerId, {
        ...layer,
        ...bounds,
      });

      return {
        ...state,
        layers: updatedLayers,
      };
    }),

  updateSelectionNet: (current, origin) => {
    const state = get();

    const ids = findIntersectingLayersWithRectangle(
      state.layerIds,
      state.layers,
      origin,
      current
    );
    state.setMyPresence(ids);
  },

  moveToFront: () =>
    set((state) => {
      let liveLayerIds = [...state.layerIds];
      const selection = state.presence.selection;

      const indices: number[] = [];

      const arr = [...liveLayerIds];

      for (let i = 0; i < arr.length; i++) {
        if (selection.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = indices.length - 1; i >= 0; i--) {
        liveLayerIds = R.move(
          indices[i],
          arr.length - 1 - (indices.length - 1 - i)
        )(liveLayerIds);
      }

      return R.mergeDeepRight(state, {
        layerIds: liveLayerIds,
      });
    }),

  moveToBack: () =>
    set((state) => {
      let liveLayerIds = [...state.layerIds];
      const selection = state.presence.selection;

      const indices: number[] = [];

      const arr = [...liveLayerIds];

      for (let i = 0; i < arr.length; i++) {
        if (selection.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = 0; i < indices.length; i++) {
        liveLayerIds = R.move(indices[i], i)(liveLayerIds);
      }

      return R.mergeDeepRight(state, {
        layerIds: liveLayerIds,
      });
    }),

  setFill: (color) =>
    set((state) => {
      const selection = state.presence.selection;

      const updatedLayers = new Map(state.layers);

      selection.forEach((id) => {
        const layer = updatedLayers.get(id);
        if (!layer) return;

        updatedLayers.set(id, {
          ...layer,
          fill: color,
        });
      });

      return R.mergeDeepRight(state, {
        layers: updatedLayers,
      });
    }),

  clearCanvas: () =>
    set((state) => ({
      ...state,
      layers: new Map(),
      layerIds: [],
    })),

  updateLayer: ({ id, layer }) =>
    set((state) => {
      const currentLayer = state.layers.get(id);
      if (!currentLayer) return state;

      return {
        ...state,
        layers: new Map(state.layers).set(id, {
          ...currentLayer,
          ...layer,
        }),
      };
    }),
}));
