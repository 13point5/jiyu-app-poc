import * as R from "ramda";
import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { CustomNodeTypes } from "@/app/constants";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 50, y: 70 },
    type: CustomNodeTypes.YOUTUBE,
    data: {
      id: "LxI0iofzKWA",
      name: 'LangChain "OpenAI functions" Webinar',
    },
  },
  // {
  //   id: "2",
  //   position: { x: 650, y: 70 },
  //   type: CustomNodeTypes.CHAT,
  //   data: {
  //     name: "Chat",
  //   },
  // },
  // {
  //   id: "3",
  //   position: { x: 1350, y: 50 },
  //   type: CustomNodeTypes.PDF,
  //   data: {
  //     path: "/The-Future-of-Educational-Assessment-White-Paper.pdf",
  //     name: "The Future of Educational Assessment",
  //   },
  // },
];
const initialEdges: Edge[] = [];

type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  updateNodeData: (id: string, data: Object) => {
    const node = get().nodes.find((n) => n.id === id);
    if (!node) return;

    const updatedNode = R.mergeDeepRight(node, { data });

    set({
      nodes: get().nodes.map((n) => (n.id === id ? updatedNode : n)),
    });
  },
  setSourcesVisibility: (id: string, show: boolean) => {
    set({
      nodes: get().nodes.map((n) => {
        if (n?.responseId === id) {
          return {
            ...n,
            hidden: !show,
          };
        }

        return n;
      }),
    });
  },
}));

export default useStore;
