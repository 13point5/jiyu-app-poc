import { FileText, MessageSquare, Youtube } from "lucide-react";

export enum CustomNodeTypes {
  PDF,
  YOUTUBE,
  CHAT,
}

export const widths = {
  [CustomNodeTypes.PDF]: 300,
  [CustomNodeTypes.YOUTUBE]: 500,
  [CustomNodeTypes.CHAT]: 600,
};

export const icons = {
  [CustomNodeTypes.PDF]: FileText,
  [CustomNodeTypes.YOUTUBE]: Youtube,
  [CustomNodeTypes.CHAT]: MessageSquare,
};
