import {
  FileText,
  Globe,
  MessagesSquare,
  StickyNote,
  Youtube,
} from "lucide-react";

export enum CustomNodeTypes {
  PDF = "pdf",
  YOUTUBE = "youtube",
  CHAT = "chat",
  NOTE = "note",
  WEBSITE = "website",
}

export const widths = {
  [CustomNodeTypes.PDF]: 600,
  [CustomNodeTypes.YOUTUBE]: 500,
  [CustomNodeTypes.CHAT]: 600,
  [CustomNodeTypes.NOTE]: 300,
  [CustomNodeTypes.WEBSITE]: 500,
};

export const icons = {
  [CustomNodeTypes.PDF]: FileText,
  [CustomNodeTypes.YOUTUBE]: Youtube,
  [CustomNodeTypes.CHAT]: MessagesSquare,
  [CustomNodeTypes.NOTE]: StickyNote,
  [CustomNodeTypes.WEBSITE]: Globe,
};

export const bgColors = {
  [CustomNodeTypes.NOTE]: "bg-yellow-200",
  [CustomNodeTypes.YOUTUBE]: "bg-red-200",
  [CustomNodeTypes.PDF]: "bg-slate-100",
  [CustomNodeTypes.CHAT]: "bg-violet-100",
  [CustomNodeTypes.WEBSITE]: "bg-blue-100",
};
