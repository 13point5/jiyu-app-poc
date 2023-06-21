import { FileText, MessagesSquare, Youtube } from "lucide-react";

export enum CustomNodeTypes {
  PDF = "pdf",
  YOUTUBE = "youtube",
  CHAT = "chat",
}

export const widths = {
  [CustomNodeTypes.PDF]: 300,
  [CustomNodeTypes.YOUTUBE]: 500,
  [CustomNodeTypes.CHAT]: 600,
};

export const icons = {
  [CustomNodeTypes.PDF]: FileText,
  [CustomNodeTypes.YOUTUBE]: Youtube,
  [CustomNodeTypes.CHAT]: MessagesSquare,
};
