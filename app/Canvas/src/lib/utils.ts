import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isCursorInsideALayer = ({ cursor, layers }) => {
  let isInsideLayer = false;

  for (let [layerId, layer] of layers) {
    if (
      cursor.x >= layer.x &&
      cursor.x <= layer.x + layer.width &&
      cursor.y >= layer.y &&
      cursor.y <= layer.y + layer.height
    ) {
      isInsideLayer = true;
      break;
    }
  }

  return isInsideLayer;
};
